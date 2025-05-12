import { ref, get, set, query, orderByChild, equalTo, update, push, onValue, off } from 'firebase/database';
import { db } from '../firebase/config';

// Subject Services
export const subjectService = {
  // Get all available subjects
  getSubjects: () => {
    return new Promise((resolve, reject) => {
      const subjectsRef = ref(db, 'subjects');
      get(subjectsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const subjectsData = snapshot.val();
            const formattedSubjects = Object.keys(subjectsData).map(key => ({
              id: key,
              value: key,
              label: subjectsData[key].name,
              ...subjectsData[key]
            }));
            resolve(formattedSubjects);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Subscribe to subject changes
  subscribeToSubjects: (callback) => {
    const subjectsRef = ref(db, 'subjects');
    onValue(subjectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const subjectsData = snapshot.val();
        const formattedSubjects = Object.keys(subjectsData).map(key => ({
          id: key,
          value: key,
          label: subjectsData[key].name,
          ...subjectsData[key]
        }));
        callback(formattedSubjects);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error("Error fetching subjects:", error);
    });

    // Return unsubscribe function
    return () => off(subjectsRef);
  }
};

// User Services
export const userService = {
  // Get user data by ID
  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      const userRef = ref(db, `users/${userId}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            resolve({ id: userId, ...snapshot.val() });
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Update user data
  updateUser: (userId, userData) => {
    return set(ref(db, `users/${userId}`), {
      ...userData,
      updatedAt: new Date().toISOString()
    });
  },

  // Subscribe to user data changes
  subscribeToUser: (userId, callback) => {
    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: userId, ...snapshot.val() });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
    });

    // Return unsubscribe function
    return () => off(userRef);
  }
};

// Tutor Services
export const tutorService = {
  // Get all tutors
  getAllTutors: () => {
    return new Promise((resolve, reject) => {
      const tutorsQuery = query(ref(db, 'users/tutors'));
      get(tutorsQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const tutorsData = snapshot.val();
            const formattedTutors = Object.keys(tutorsData).map(key => ({
              id: key,
              ...tutorsData[key]
            }));
            resolve(formattedTutors);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Get tutors by subject
  getTutorsBySubject: (subjectId) => {
    return new Promise((resolve, reject) => {
      // First get all tutors
      tutorService.getAllTutors()
        .then((tutors) => {
          // Filter by subject
          const filteredTutors = tutors.filter(tutor => 
            tutor.subjects && tutor.subjects.includes(subjectId)
          );
          resolve(filteredTutors);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Update tutor availability
  updateAvailability: (tutorId, availability) => {
    return update(ref(db, `users/tutors/${tutorId}`), { 
      availability,
      updatedAt: new Date().toISOString()
    });
  }
};

// Student Services
export const studentService = {
  // Get all students
  getAllStudents: () => {
    return new Promise((resolve, reject) => {
      const studentsQuery = query(ref(db, 'users/students'));
      get(studentsQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const studentsData = snapshot.val();
            const formattedStudents = Object.keys(studentsData).map(key => ({
              id: key,
              ...studentsData[key]
            }));
            resolve(formattedStudents);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Get tutor's students
  getTutorStudents: (tutorId) => {
    return new Promise((resolve, reject) => {
      // Get all sessions for this tutor
      const sessionsQuery = query(ref(db, 'sessions'), orderByChild('tutorId'), equalTo(tutorId));
      get(sessionsQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const sessions = snapshot.val();
            // Extract unique student IDs
            const studentIds = [...new Set(Object.values(sessions).map(session => session.studentId))];
            
            // Get student details for each ID
            Promise.all(studentIds.map(id => userService.getUserById(`students/${id}`)))
              .then(students => {
                resolve(students.filter(s => s !== null));
              })
              .catch(reject);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Update student subscription
  updateSubscription: (studentId, plan) => {
    const startDate = new Date().toISOString();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    return update(ref(db, `users/students/${studentId}`), { 
      subscriptionPlan: plan,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate.toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
};

// Session Services
export const sessionService = {
  // Get all sessions
  getAllSessions: () => {
    return new Promise((resolve, reject) => {
      const sessionsRef = ref(db, 'sessions');
      get(sessionsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const sessionsData = snapshot.val();
            const formattedSessions = Object.keys(sessionsData).map(key => ({
              id: key,
              ...sessionsData[key]
            }));
            resolve(formattedSessions);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Get tutor sessions
  getTutorSessions: (tutorId) => {
    return new Promise((resolve, reject) => {
      const sessionsQuery = query(ref(db, 'sessions'), orderByChild('tutorId'), equalTo(tutorId));
      get(sessionsQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const sessionsData = snapshot.val();
            const formattedSessions = Object.keys(sessionsData).map(key => ({
              id: key,
              ...sessionsData[key]
            }));
            resolve(formattedSessions);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Get student sessions
  getStudentSessions: (studentId) => {
    return new Promise((resolve, reject) => {
      const sessionsQuery = query(ref(db, 'sessions'), orderByChild('studentId'), equalTo(studentId));
      get(sessionsQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const sessionsData = snapshot.val();
            const formattedSessions = Object.keys(sessionsData).map(key => ({
              id: key,
              ...sessionsData[key]
            }));
            resolve(formattedSessions);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Create a new session
  createSession: (sessionData) => {
    const sessionsRef = ref(db, 'sessions');
    return push(sessionsRef, {
      ...sessionData,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    });
  },

  // Update a session
  updateSession: (sessionId, sessionData) => {
    return update(ref(db, `sessions/${sessionId}`), {
      ...sessionData,
      updatedAt: new Date().toISOString()
    });
  },

  // Cancel a session
  cancelSession: (sessionId) => {
    return update(ref(db, `sessions/${sessionId}`), {
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    });
  },

  // Complete a session
  completeSession: (sessionId, feedback = null) => {
    return update(ref(db, `sessions/${sessionId}`), {
      status: 'completed',
      ...(feedback && { feedback }),
      updatedAt: new Date().toISOString()
    });
  },

  // Subscribe to tutor sessions
  subscribeToTutorSessions: (tutorId, callback) => {
    const sessionsQuery = query(ref(db, 'sessions'), orderByChild('tutorId'), equalTo(tutorId));
    onValue(sessionsQuery, (snapshot) => {
      if (snapshot.exists()) {
        const sessionsData = snapshot.val();
        const formattedSessions = Object.keys(sessionsData).map(key => ({
          id: key,
          ...sessionsData[key]
        }));
        callback(formattedSessions);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error("Error fetching tutor sessions:", error);
    });

    // Return unsubscribe function
    return () => off(sessionsQuery);
  },

  // Subscribe to student sessions
  subscribeToStudentSessions: (studentId, callback) => {
    const sessionsQuery = query(ref(db, 'sessions'), orderByChild('studentId'), equalTo(studentId));
    onValue(sessionsQuery, (snapshot) => {
      if (snapshot.exists()) {
        const sessionsData = snapshot.val();
        const formattedSessions = Object.keys(sessionsData).map(key => ({
          id: key,
          ...sessionsData[key]
        }));
        callback(formattedSessions);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error("Error fetching student sessions:", error);
    });

    // Return unsubscribe function
    return () => off(sessionsQuery);
  }
};

// Resource Services
export const resourceService = {
  // Get all resources
  getAllResources: () => {
    return new Promise((resolve, reject) => {
      const resourcesRef = ref(db, 'resources');
      get(resourcesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const resourcesData = snapshot.val();
            let formattedResources = [];
            
            // Process nested structure
            Object.keys(resourcesData).forEach(subjectKey => {
              const subjectResources = resourcesData[subjectKey];
              Object.keys(subjectResources).forEach(categoryKey => {
                const categoryResources = subjectResources[categoryKey];
                Object.keys(categoryResources).forEach(resourceKey => {
                  formattedResources.push({
                    id: resourceKey,
                    subjectId: subjectKey,
                    category: categoryKey,
                    ...categoryResources[resourceKey]
                  });
                });
              });
            });
            
            resolve(formattedResources);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Get resources by subject
  getResourcesBySubject: (subjectId) => {
    return new Promise((resolve, reject) => {
      const subjectResourcesRef = ref(db, `resources/${subjectId}`);
      get(subjectResourcesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const resourcesData = snapshot.val();
            let formattedResources = [];
            
            // Process nested structure
            Object.keys(resourcesData).forEach(categoryKey => {
              const categoryResources = resourcesData[categoryKey];
              Object.keys(categoryResources).forEach(resourceKey => {
                formattedResources.push({
                  id: resourceKey,
                  subjectId: subjectId,
                  category: categoryKey,
                  ...categoryResources[resourceKey]
                });
              });
            });
            
            resolve(formattedResources);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Track resource access
  trackResourceAccess: (userId, resourceId) => {
    // First get current user data
    return userService.getUserById(userId)
      .then(userData => {
        if (!userData) throw new Error("User not found");
        
        // Only track if free resource and user is on free plan
        if (userData.subscriptionPlan === 'free') {
          const newCount = (userData.freeResourcesAccessed || 0) + 1;
          return update(ref(db, `users/${userId}`), { 
            freeResourcesAccessed: newCount,
            updatedAt: new Date().toISOString()
          });
        }
        return Promise.resolve();
      });
  }
};

// Subscription Services
export const subscriptionService = {
  // Get all subscription plans
  getSubscriptionPlans: () => {
    return new Promise((resolve, reject) => {
      const plansRef = ref(db, 'subscriptionPlans');
      get(plansRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const plansData = snapshot.val();
            const formattedPlans = Object.keys(plansData).map(key => ({
              id: key,
              ...plansData[key]
            }));
            resolve(formattedPlans);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};