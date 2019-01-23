import ClientError from 'errors/clientError';

const methodAllowedCurry = link => method =>
  (link.allow || 'GET').split(' ').includes(method);

const setMethodCurry = link => method => {
  if (!methodAllowedCurry(link)(method)) {
    throw new ClientError(
      `Relation ${link._type} on resource ${
        link._resource()._type
      } does not allow ${method}`
    );
  }

  return { ...link, _method: method };
};

const decorateLinkRelation = (resource, relation, link) => {
  const result = { ...link, _type: relation, _resource: () => resource };

  result._allowed = methodAllowedCurry(result);
  result._setMethod = method =>
    decorateLinkRelation(resource, relation, setMethodCurry(result)(method));

  return result;
};

const decorateLink = (resource, relation, link) =>
  Array.isArray(link)
    ? link.map(linkItem => decorateLink(resource, relation, linkItem))
    : decorateLinkRelation(resource, relation, link);

const parseHal = body => {
  let result = JSON.parse(JSON.stringify(body));

  if (result._embedded) {
    const embedded = result._embedded;

    Object.entries(embedded).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        embedded[key] = value.map(element =>
          parseHal({ ...element, _partial: true })
        );
      } else {
        embedded[key]._partial = true;
        embedded[key] = parseHal(embedded[key]);
      }
    });

    result = { ...result, ...embedded };
    delete result._embedded;
  }

  if (result._links) {
    const links = result._links;

    if (links.type) {
      result = { ...result, _type: links.type.href };
      delete result._links.type;
    }

    Object.entries(result._links).forEach(([key, value]) => {
      result._links[key] = decorateLink(result, key, value);
    });
  }

  return result;
};

export default parseHal;
