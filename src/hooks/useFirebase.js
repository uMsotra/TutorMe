import { useState, useEffect } from 'react';
import { 
  subjectService, 
  userService, 
  tutorService, 
  studentService, 
  sessionService,
  resourceService,
  subscriptionService
} from '../services/firebase.services';

// Hook for subjects data
export const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const data = await subjectService.getSubjects();
        setSubjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return { subjects, loading, error };
};

// Hook for subscribing to real-time data updates
export const useSubjectsSubscription = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to subjects
    const unsubscribe = subjectService.subscribeToSubjects((data) => {
      setSubjects(data);
      setLoading(false);
    });

    return () => {
      // Cleanup subscription on unmount
      unsubscribe();
    };
  }, []);

  return { subjects, loading, error };
};

// Hook for user data
export const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserById(userId);
        setUserData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Function to update user data
  const updateUserData = async (newData) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      await userService.updateUser(userId, { ...userData, ...newData });
      // Refresh data
      const updatedData = await userService.getUserById(userId);
      setUserData(updatedData);
      return true;
    } catch (err) {
      console.error('Error updating user data:', err);
      setError('Failed to update user data');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { userData, updateUserData, loading, error };
};

// Hook for real-time user data updates
export const useUserDataSubscription = (userId) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to user data changes
    const unsubscribe = userService.subscribeToUser(userId, (data) => {
      setUserData(data);
      setLoading(false);
    });

    return () => {
      // Cleanup subscription on unmount
      unsubscribe();
    };
  }, [userId]);

  // Function to update user data
  const updateUserData = async (newData) => {
    if (!userId) return;
    
    try {
      await userService.updateUser(userId, { ...userData, ...newData });
      return true;
    } catch (err) {
      console.error('Error updating user data:', err);
      setError('Failed to update user data');
      return false;
    }
  };

  return { userData, updateUserData, loading, error };
};

// Hook for tutor sessions
export const useTutorSessions = (tutorId) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tutorId) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await sessionService.getTutorSessions(tutorId);
        setSessions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tutor sessions:', err);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [tutorId]);

  // Get upcoming sessions only
  const upcomingSessions = sessions.filter(session => 
    session.status === 'scheduled' && new Date(session.date) > new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get past sessions only
  const pastSessions = sessions.filter(session => 
    session.status === 'completed'
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  return { 
    sessions, 
    upcomingSessions, 
    pastSessions,
    loading, 
    error 
  };
};

// Hook for student sessions
export const useStudentSessions = (studentId) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await sessionService.getStudentSessions(studentId);
        setSessions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching student sessions:', err);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [studentId]);

  // Get upcoming sessions only
  const upcomingSessions = sessions.filter(session => 
    session.status === 'scheduled' && new Date(session.date) > new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get past sessions only
  const pastSessions = sessions.filter(session => 
    session.status === 'completed'
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  return { 
    sessions, 
    upcomingSessions, 
    pastSessions,
    loading, 
    error 
  };
};

// Hook for real-time session updates
export const useSessionsSubscription = (userId, role) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !role) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe based on role
    const unsubscribe = 
      role === 'tutor' 
        ? sessionService.subscribeToTutorSessions(userId, setSessions)
        : sessionService.subscribeToStudentSessions(userId, setSessions);

    setLoading(false);

    return () => {
      // Cleanup subscription on unmount
      unsubscribe();
    };
  }, [userId, role]);

  // Get upcoming sessions only
  const upcomingSessions = sessions.filter(session => 
    session.status === 'scheduled' && new Date(session.date) > new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get past sessions only
  const pastSessions = sessions.filter(session => 
    session.status === 'completed'
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  return { 
    sessions, 
    upcomingSessions, 
    pastSessions, 
    loading, 
    error 
  };
};

// Hook for resources
export const useResources = (subjectId = null) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        let data;
        
        if (subjectId) {
          data = await resourceService.getResourcesBySubject(subjectId);
        } else {
          data = await resourceService.getAllResources();
        }
        
        setResources(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [subjectId]);

  // Function to access a resource (track usage for free users)
  const accessResource = async (userId, resourceId) => {
    if (!userId || !resourceId) return true;
    
    try {
      await resourceService.trackResourceAccess(userId, resourceId);
      return true;
    } catch (err) {
      console.error('Error tracking resource access:', err);
      return false;
    }
  };

  return { 
    resources, 
    accessResource,
    loading, 
    error 
  };
};

// Hook for subscription plans
export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await subscriptionService.getSubscriptionPlans();
        setPlans(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
        setError('Failed to load subscription plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};

// Hook for tutor's students
export const useTutorStudents = (tutorId) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tutorId) {
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await studentService.getTutorStudents(tutorId);
        setStudents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tutor students:', err);
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [tutorId]);

  return { students, loading, error };
};

// Hook for all tutors
export const useAllTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const data = await tutorService.getAllTutors();
        setTutors(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return { tutors, loading, error };
};

// Hook for tutors by subject
export const useTutorsBySubject = (subjectId) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subjectId) {
      setLoading(false);
      return;
    }

    const fetchTutors = async () => {
      try {
        setLoading(true);
        const data = await tutorService.getTutorsBySubject(subjectId);
        setTutors(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tutors by subject:', err);
        setError('Failed to load tutors');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [subjectId]);

  return { tutors, loading, error };
};