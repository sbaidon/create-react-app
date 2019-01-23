import { completeTask, createTask, deleteTask, loadTasks } from 'utils/api';

describe('api', () => {
  const tasks = [{}, {}, {}];

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => {
      const promise = new Promise(resolve => {
        resolve({
          json: () => tasks,
        });
      });

      return promise;
    });
  });

  it('createTask', async () => {
    const response = await createTask();

    expect(response.length).toEqual(3);
  });

  it('loadTasks', async () => {
    const response = await loadTasks();

    expect(response.length).toEqual(3);
  });

  it('deleteTask', async () => {
    const response = await deleteTask({ id: 1 });

    expect(response.length).toEqual(3);
  });

  it('completeTask', async () => {
    const response = await completeTask({ id: 1 });

    expect(response.length).toEqual(3);
  });
});
