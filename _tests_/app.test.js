const request = require('supertest');
const app = require('../app');
const { ObjectId } = require('mongodb'); 
require('jest-sorted');
// const { prepareData } = require('../services/prepareData'); 

describe('tetriPlan', () => {
    //GET api all endpoints
    describe('/api', () =>{
      test('GET 200: Responds with an object describing all the available endpoints on your API', () => {
        return request(app)
        .get('/api/')
        .expect(200)
        .then(({body}) =>{
            const { endpoint } = body;
            expect(endpoint).toBe(endpoint);
        });
      });
    });

    //GET users
    describe('/api/users', () => {
      test('GET 200: Responds with an array of objects of users.', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
              const { users } = body;
              expect(Array.isArray(users)).toBe(true);
              users.forEach(user => {
                  expect(typeof user._id).toBe('string');
                  expect(typeof user.username).toBe('string');
                  expect(typeof user.email).toBe('string');
                  expect(typeof user.fullName).toBe('string');
              });
        });
      });
    });

    // GET user by username
    describe('/api/users/:username', () => {
        test("GET 200: Responds with getting an user by its username.", () => {
          return request(app)
            .get('/api/users/tamz')
            .expect(200)
            .then(({ body }) => {
              const {user} = body;

                expect(user._id).toEqual('6650b8fe20ff98d6b1d37541');
                expect(user.username).toBe('tamz');
                expect(user.email).toBe('tamyahussain@gmail.com');
                expect(user.fullName).toBe('Tamya Hussain');
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

        //POST user
        test("POST 201: Add a new user.", () => {
          return request(app)
          .post('/api/users/Bob789')
          .send({
            username: "Bob789",
            email: "bobForgotten@gmail.com",
            fullName: "Bob Forgotten"
          })
          .expect(201)
          .then(({ body }) => {
              const { savedUser } = body;
              expect(savedUser).toMatchObject({
              username: "Bob789",
              email: "bobForgotten@gmail.com",
              fullName: "Bob Forgotten"
              });
        
          });
        });

        //POST Respond with 404 if user that exists
        test("POST 400: Responds with message if username taken.", () => {
          return request(app)
          .post('/api/users/tamz')
          .send({
            username: "tamz",
            email: "tamyahussain@gmail.com",
            fullName: "Tamya Hussain"
          })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe('username taken');
          });
        });

        //PATCH user 
        test("PATCH 202: Responds with an updated task.", () => {
          const updatedFields = {
            email: "bobForgot@gmail.com",
            fullName: "Bob Forgot"
          };
          return request(app)
          .patch('/api/users/Bob789')
          .send(updatedFields)
          .expect(202)
          .then(({ body }) => {
              const { update } = body;
              expect(update).toMatchObject({
              _id: expect.any(String),
              username: "Bob789",
              email: "bobForgot@gmail.com",
              fullName: "Bob Forgot" 
              });
          });
        });

        //DELETE user
        test("DELETE 204: delete the given user by username", () => {
          return request(app)
          .delete('/api/users/Bob789')
          .expect(204)
        });

      });


    //GET tasks
    describe('/api/tasks', () => {
        test('GET 200: Responds with an array of tasks objects.', () => {
            return request(app)
              .get('/api/tasks')
              .expect(200)
              .then(({ body }) => {
                const { tasks } = body;
                console.log(tasks)
                tasks.forEach(task => {
                  expect(ObjectId.isValid(task._id)).toBe(true);
                  expect(typeof task.userID).toBe('string');
                  expect(typeof task.taskName).toBe('string');
                  expect(typeof task.description).toBe('string');
                  expect(typeof task.category).toBe('string');
                  expect(typeof task.startTime).toBe('string');
                  expect(typeof task.endTime).toBe('string');
                  expect(typeof task.duration).toBe('number');
                  expect(typeof task.completionStatus).toBe('boolean');
                  expect(typeof task.label).toBe('string');
                  expect(typeof task.priority).toBe('string');
                  expect(typeof task.dateAdded).toBe('string');
                  expect(typeof task.__v).toBe('number');
                  expect(typeof task.calendar).toBe('string');
                });
            });
        });
    });

     //GET tasks by id
    describe('/api/tasks/:taskID', () => {
      test('GET 200: Responds with a task based on id .', () => {
          return request(app)
            .get('/api/tasks/6650b72317a8e89ee1e7c505')
            .expect(200)
            .then(({ body }) => {
              const { task } = body;

                expect(ObjectId.isValid(task._id)).toBe(true);
                expect(ObjectId.isValid(task.userID)).toBe(true);
                expect(task.taskName).toBe('Walk The Cat');
                expect(task.description).toBe('I need to walk the cat after work');
                expect(task.category).toBe('Pets');
                expect(task.startTime).toBe('19:00');
                expect(task.endTime).toBe('19:40');
                expect(task.duration).toBe(40);
                expect(task.completionStatus).toBe(false);
                expect(task.label).toBe('Personal');
                expect(task.priority).toBe('low');
                expect(typeof task.dateAdded).toBe('string');
                expect(typeof task.__v).toBe('number');
                expect(task.calendar).toBe('2024-02-27');
          });
      });

      test("GET 404: Responds with an error if an id that does not exist is passed.", () => {
        return request(app)
          .get('/api/tasks/6650b72689a8e89ee1e7c505')
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe('Task not found');
        });
      });

      //PATCH task by task_id
      test("PATCH 202: Responds with an updated task.", () => {
        const updatedFields = {
          taskName: 'Patch Working again',
          description: 'description updated',
          startTime: '09:10',
          endTime: '09:50',
          calendar: '2024-04-27'
        };
        return request(app)
        .patch('/api/tasks/6650b72317a8e89ee1e7c505')
        .send(updatedFields)
        .expect(202)
        .then(({ body }) => {
            const { update } = body;
            expect(update).toMatchObject({
            _id: expect.any(String),
            userID: expect.any(String),
            taskName: "Patch Working again",
            description:'description updated',
            category: 'Driving',
            startTime: '09:10',
            endTime: '09:50',
            duration: 60,
            completionStatus: false,
            label: 'Personal',
            priority: 'medium',
            dateAdded: expect.any(String),
            __v: 0,
            calendar: '2024-04-27' 
            });
        });
      });

      //DELETE task by task_id
      test("DELETE 204: delete the given task by task_id", () => {
        return request(app)
        .delete('/api/tasks/6650b72317a8e89ee1e7c505')
        .expect(204)
        });
      });

    //GET tasks by username
    describe('/api/users/:username/tasks', () => {
        test('GET 200: Responds with an array of tasks objects.', () => {
            return request(app)
              .get('/api/users/tamz/tasks')
              .expect(200)
              .then(({ body }) => {
                const { tasks } = body;
                
                tasks.forEach(task => {
                  expect(ObjectId.isValid(task._id)).toBe(true);
                  expect(typeof task.userID).toBe('string');
                  expect(typeof task.taskName).toBe('string');
                  expect(typeof task.description).toBe('string');
                  expect(typeof task.category).toBe('string');
                  expect(typeof task.startTime).toBe('string');
                  expect(typeof task.endTime).toBe('string');
                  expect(typeof task.duration).toBe('number');
                  expect(typeof task.completionStatus).toBe('boolean');
                  expect(typeof task.label).toBe('string');
                  expect(typeof task.priority).toBe('string');
                  expect(typeof task.dateAdded).toBe('string');
                  expect(typeof task.__v).toBe('number');
                  expect(typeof task.calendar).toBe('string');
                });
            });
        });

        test("GET 404: Responds with an error if passed a wrong path or non-existent endpoint.", () => {
            return request(app)
              .get('/api/users/tamz/tasks!')
              .expect(404)
              .then(({ body }) => {
                const { message } = body; 
                expect(message).toBe('endpoint not found');
            });
        });

        //POST task
        test("POST 201: Add a new task.", () => {
            return request(app)
            .post('/api/users/tamz/tasks')
            .send({
              taskName: "Walk The Cat",
              description: "I need to walk the cat after work",
              category: "Pets",
              startTime: "19:00",
              endTime: "19:40",
              duration: 40,
              label: "Personal",
              priority: "low",
              calendar: '2024-05-21'
            })
            .expect(201)
            .then(({ body }) => {
                const { savedTask } = body;
                expect(savedTask).toMatchObject({
                userID: expect.any(String),
                taskName: 'Walk The Cat',
                description: 'I need to walk the cat after work',
                category: 'Pets',
                startTime: '19:00',
                endTime: '19:40',
                duration: 40,
                completionStatus: false,
                label: 'Personal',
                priority: 'low',
                dateAdded: expect.any(String),
	              __v: 0,
                calendar: '2024-05-21',
            });
          });
        });

        //GET tasks by category
        test("GET 200: Dependant on category, respond with all tasks related to that category.", () => {
            return request(app)
            .get('/api/users/jck/tasks?category=Pets')
            .expect(200)
            .then(({ body }) => {
                const { tasks } = body;
                
                    tasks.forEach((task) => {
                      expect(task.category).toBe('Pets')
                    })
            });
        });

        //GET tasks by category that does not exist
        test("GET 404: Querying for a category that does not exist.", () => {
            return request(app)
              .get('/api/users/tamz/tasks?category=banana')
              .expect(404)
              .then(({ body: { message } }) => {
                expect(message).toBe(`this endpoint doesn't exist`);
            });
        });
  
        //GET tasks by sort_by date
        test("GET 200: FEATURE REQUEST Responds with sorting queries.", () => {
            return request(app)
            .get('/api/users/tamz/tasks?sort=date')
            .expect(200)
            .then(({ body }) => {
                const { tasks } = body;
                  expect(tasks).toBeSortedBy('calendar', {descending: true });
            })
        });

        //GET tasks by sort_by priority
        test("GET 200: FEATURE REQUEST Responds with sorting queries.", () => {
            return request(app)
            .get('/api/users/tamz/tasks?sort=priority')
            .expect(200)
            .then(({ body }) => {
                const { tasks } = body;
                  expect(tasks).toBeSortedBy('priority', {descending: true });
            })
        });

        //GET tasks by sort_by label
        test("GET 200: FEATURE REQUEST Responds with sorting queries.", () => {
            return request(app)
            .get('/api/users/:username/tasks?sort=label')
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

    describe.skip('/api/users/:username/recommended-tasks', () => {
      beforeAll(async () => {
        await prepareData(); // Ensure data is prepared before running the test, that way process.exit won't run
    });
      test("GET 200: Responds with recommended tasks for the user.", () => {
        return request(app)
        .get('/api/users/tamz/recommended-tasks')
        .expect(200)
        .then(({ body }) => {
            const { recommendedTasks } = body;
            expect(Array.isArray(recommendedTasks)).toBe(true);
            if (recommendedTasks.length > 0) {
              expect(recommendedTasks[0]).toMatchObject({
                  _id: expect.any(String),
                  userID: expect.any(String),
                  taskName: expect.any(String),
                  description: expect.any(String),
                  category: expect.any(String),
                  startTime: expect.any(String),
                  endTime: expect.any(String),
                  duration: expect.any(Number),
                  completionStatus: expect.any(Boolean),
                  label: expect.any(String),
                  priority: expect.any(String),
                  dateAdded: expect.any(String),
                  __v: expect.any(Number),
                  calendar: expect.any(String)
            });
          }
        })
      });
    });
   
});