const request = require('supertest');
const app = require('../app');

describe('tetriPlan', () => {
    //GET api all endpoints
    describe('/api', () =>{
        test('', () => {

        })
    });

    //GET users
    describe('/api/users', () =>{
        test('GET 200: Responds with an an array of objects of users.', () => {
            return request(app)
              .get('/api/users')
              .expect(200)
              .then(({ body }) => {
                const { users } = body;
                expect(users).toHaveLength(4);
      
                users.forEach(user => {
                  expect(typeof user.username).toBe('string');
                  expect(typeof user.name).toBe('string');
                  expect(typeof user.email).toBe('string');
                  expect(typeof user.avatar_url).toBe('string');
                });
            });
        });   
    });

    // GET user by username
    describe('/api/users/:username', () => {
        test("GET 200: Responds with getting an user by its id.", () => {
          return request(app)
            .get('/api/users/tamya')
            .expect(200)
            .then(({ body }) => {
              const { users } = body;
                expect(users.username).toBe('tamya');
                expect(users.name).toBe('tamya hussain');
                expect(users.avatar_url).toBe('grab from database');
              });
          });
          
          test("GET 404: Bad request of username.", () => {
            return request(app)
              .get('/api/users/hollow_tree')
              .expect(404)
              .then(({ body: { message } }) => {
                expect(message).toBe('user not found');
            });
        });
    });

    //GET tasks
    describe('/api/users/:username/tasks', () => {
        test('GET 200: Responds with an array of tasks object.', () => {
            return request(app)
              .get('/api/topics')
              .expect(200)
              .then(({ body }) => {
                const { tasks } = body;
                expect(tasks).toHaveLength(13);
      
                tasks.forEach(task => {
                  expect(typeof task.taskID).toBe('string');
                  expect(typeof task.userID).toBe('string');
                  expect(typeof task.taskName).toBe('string');
                  expect(typeof task.description).toBe('string');
                  expect(typeof task.category).toBe('string');
                  expect(typeof task.date).toBe('string');
                  expect(typeof task.startTime).toBe('string');
                  expect(typeof task.endTime).toBe('string');
                  expect(typeof task.duration).toBe('string');
                  expect(typeof task.completionStatus).toBe('boolean');
                  expect(typeof task.tags).toBe('array');
                  expect(typeof task.label).toBe('string');
                  expect(typeof task.priority).toBe('string');
                });
            });
        });

        test("GET 404: Responds with an error if passed a wrong path or non-existent endpoint.", () => {
            return request(app)
              .get('/api/users/:username/tasks!')
              .expect(404)
              .then(({ body }) => {
                const { message } = body; 
                expect(message).toBe('endpoint not found');
            });
        });

        //POST task
        test("POST 201: Add a new task.", () => {
            return request(app)
            .post('/api/users/:username/tasks')
            .send({
                taskName: 'Walk The Cat',
                description: 'I need to walk the cat after work',
                category: 'Pets',
                duration: '40 minutes',
                label: 'Personal',
                priority: 'low'
            })
            .expect(201)
            .then(({ body }) => {
                const { tasks } = body;
                expect(tasks).toMatchObject({
                taskID: '234',
                userID: 'unknown',
                taskName: 'Walk The Cat',
                description: 'I need to walk the cat after work',
                category: 'Pets',
                date: '2024-05-21 (still need to check)',
                startTime: '19:00',
                endTime: '19:40',
                duration: '40 minutes',
                completionStatus: 'cats',
                label: 'Personal',
                priority: 'low'
            });
          });
        });
        
        //GET task by order=desc
        test("GET 200: Responds with an array of tasks of task objects, in descending order.", () => {
            return request(app)
              .get('/api/users/:username/tasks?order=desc')
              .expect(200)
              .then(({ body }) => {
                const { tasks } = body;
                expect(tasks).toBeSortedBy('date', {descending: true });
            });
        });

        //GET tasks by category
        test("GET 200: Dependant on category, respond with all tasks related to that category.", () => {
            return request(app)
            .get('/api/users/:username/tasks?category=Pets')
            .expect(200)
            .then(({ body }) => {
                const { tasks } = body;
                  expect(tasks.length).toBe(1);
                    tasks.forEach((task) => {
                      expect(task.category).toBe('Pets')
                })
            });
        });

        //GET tasks by category that is empty
        test("GET 200: Querying for a topic that is empty.", () => {
            return request(app)
              .get('/api/users/:username/tasks?category=Home')
              .expect(200)
              .then(({ body }) => {
                const { tasks } = body;
                  expect(Array.isArray(tasks)).toBe(true);
                  expect(tasks.length).toBe(0);
            });
        });

        //GET tasks by category that does not exist
        test("GET 404: Querying for a category that does not exist.", () => {
            return request(app)
              .get('/api/users/:username/tasks?category=banana')
              .expect(404)
              .then(({ body: { message } }) => {
                expect(message).toBe('Topic not found');
            });
        });
  
        //GET tasks by sort_by date
        test("GET 200: FEATURE REQUEST Responds with sorting queries.", () => {
            return request(app)
            .get('/api/users/:username/tasks')
            .expect(200)
            .then(({ body }) => {
                const { tasks } = body;
                  expect(tasks).toBeSortedBy('date', {descending: true });
            })
        });

        //GET tasks by sort_by priority
        test("GET 200: FEATURE REQUEST Responds with sorting queries.", () => {
            return request(app)
            .get('/api/users/:username/tasks?sort_by=priority')
            .expect(200)
            .then(({ body }) => {
                const { tasks } = body;
                  expect(tasks).toBeSortedBy('priority', {descending: true });
            })
        });

        //GET tasks by sort_by label
        test("GET 200: FEATURE REQUEST Responds with sorting queries.", () => {
            return request(app)
            .get('/api/users/:username/tasks?sort_by=label')
            .expect(200)
            .then(({ body }) => {
                const { tasks } = body;
                  expect(tasks).toBeSortedBy('label', {descending: true });
            })
        });
  
        test("GET 400: Responds with an error if passed an invalid sort order.", () => {
            return request(app)
              .get('/api/users/:username/tasks?order=banana')
              .expect(400)
              .then(({ body: { message } }) => {
                expect(message).toBe('invalid sort order');
            });
        });
  
        test("GET 400: Responds with an error if passed an invalid sort_by.", () => {
            return request(app)
              .get('/api/users/:username/tasks?sort_by=something')
              .expect(400)
              .then(({ body: { message } }) => {
                expect(message).toBe('invalid query value');
            });
        });
    });

    //GET task by task_id
    describe('/api/tasks/:taskID', () => {
        test("GET 200: Responds with getting an task by its id.", () => {
            return request(app)
              .get('/api/tasks/(discuss with jack)')
              .expect(200)
              .then(({ body }) => {
                const { tasks } = body;
                  expect(tasks.taskID).toBe('unknown');
                  expect(tasks.userID).toBe('needs to be generated by users');
                  expect(tasks.taskName).toBe('Example Task');
                  expect(tasks.description).toBe('This is an example task.');
                  expect(tasks.category).toBe('Work');
                  expect(typeof tasks.date).toBe('2024-05-19');
                  expect(tasks.startTime).toBe('09:00');
                  expect(tasks.endTime).toBe('11:00');
                  expect(tasks.duration).toBe('2 hours');
                  expect(tasks.completionStatus).toBe(false);
                  expect(typeof tasks.tags).toBe('array');
                  expect(tasks.label).toBe('Personal');
                  expect(tasks.priority).toBe('high');
            });
        });

        test("GET 404: Responds with an error if an id that does not exist is passed.", () => {
            return request(app)
              .get('/api/users/:username/tasks/105')
              .expect(404)
              .then(({ body: { message } }) => {
                expect(message).toBe('article id not found');
            });
        });

        //PATCH task by task_id
        test("PATCH 202: Responds with an updated task.", () => {
            return request(app)
            .patch('/api/users/:username/tasks/123')
            .send({
                taskName:'Test Task updated',
                description:'description updated',
                startTime: '9:10',
                endTime: '10:10'
            })
            .expect(202)
            .then(({ body }) => {
                const { update } = body;
                expect(update).toMatchObject({
                taskID: '123',
                userID: '456',
                taskName: "Test Task updated",
                description:'description updated',
                category: 'Test',
                date: expect.any(String),
                startTime: 'I find this existence challenging',
                duration: '1 hour',
                completionStatus: false,
                label: 'Test Label',
                priority: 'High'
                });
            });
        });

        //DELETE task by task_id
        test("DELETE 204: delete the given task by task_id", () => {
            return request(app)
            .delete('/api/tasks/4')
            .expect(204)
        });
    });
})