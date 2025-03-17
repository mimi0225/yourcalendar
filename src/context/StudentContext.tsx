
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Class, Assignment, Test, Project, ClassPriority, AssignmentType, TestType, ProjectType } from '@/types/calendar';
import { useToast } from '@/hooks/use-toast';

// Sample class colors
export const classColorOptions = [
  { name: 'Purple', value: '#9b87f5' },
  { name: 'Green', value: '#8BE8CB' },
  { name: 'Orange', value: '#FEC6A1' },
  { name: 'Pink', value: '#FFDEE2' },
  { name: 'Blue', value: '#D3E4FD' },
  { name: 'Yellow', value: '#FEF7CD' },
  { name: 'Red', value: '#FF6B6B' },
  { name: 'Teal', value: '#4ECDC4' },
];

// Sample data
const sampleClasses: Class[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Smith',
    location: 'Science Building 101',
    days: ['Monday', 'Wednesday', 'Friday'],
    startTime: '09:00',
    endTime: '10:30',
    color: '#9b87f5',
    priority: 'high',
  },
  {
    id: '2',
    name: 'Calculus II',
    instructor: 'Prof. Johnson',
    location: 'Math Hall 205',
    days: ['Tuesday', 'Thursday'],
    startTime: '11:00',
    endTime: '12:30',
    color: '#8BE8CB',
    priority: 'medium',
  },
];

const sampleAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Programming Exercise 2',
    classId: '1',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    type: 'homework',
    description: 'Complete exercises 2.1-2.5 from the textbook',
    completed: false,
    weight: 10,
  },
];

const sampleTests: Test[] = [
  {
    id: '1',
    title: 'Midterm Exam',
    classId: '2',
    date: new Date(new Date().setDate(new Date().getDate() + 14)),
    time: '11:00',
    type: 'midterm',
    location: 'Math Hall 205',
    topics: ['Derivatives', 'Integrals', 'Applications'],
    completed: false,
  },
];

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Final Project',
    classId: '1',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    type: 'group',
    description: 'Build a simple web application',
    teamMembers: ['John Doe', 'Jane Smith'],
    milestones: [
      {
        title: 'Project Proposal',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        completed: true
      },
      {
        title: 'UI Mockups',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
        completed: false
      },
      {
        title: 'Final Submission',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        completed: false
      }
    ],
    completed: false,
    weight: 25
  }
];

interface StudentContextType {
  classes: Class[];
  assignments: Assignment[];
  tests: Test[];
  projects: Project[];
  addClass: (newClass: Omit<Class, 'id'>) => void;
  updateClass: (updatedClass: Class) => void;
  deleteClass: (classId: string) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (assignmentId: string) => void;
  toggleAssignmentCompletion: (assignmentId: string) => void;
  addTest: (test: Omit<Test, 'id'>) => void;
  updateTest: (test: Test) => void;
  deleteTest: (testId: string) => void;
  toggleTestCompletion: (testId: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  toggleProjectCompletion: (projectId: string) => void;
  toggleProjectMilestoneCompletion: (projectId: string, milestoneIndex: number) => void;
  getClassById: (classId: string) => Class | undefined;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<Class[]>(sampleClasses);
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments);
  const [tests, setTests] = useState<Test[]>(sampleTests);
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const { toast } = useToast();

  // Load saved data from localStorage when component mounts
  useEffect(() => {
    const savedClasses = localStorage.getItem('studentClasses');
    const savedAssignments = localStorage.getItem('studentAssignments');
    const savedTests = localStorage.getItem('studentTests');
    const savedProjects = localStorage.getItem('studentProjects');
    
    if (savedClasses) {
      try {
        setClasses(JSON.parse(savedClasses));
      } catch (error) {
        console.error('Failed to parse saved classes', error);
      }
    }
    
    if (savedAssignments) {
      try {
        const parsedAssignments = JSON.parse(savedAssignments);
        const assignmentsWithDates = parsedAssignments.map((assignment: any) => ({
          ...assignment,
          dueDate: new Date(assignment.dueDate)
        }));
        setAssignments(assignmentsWithDates);
      } catch (error) {
        console.error('Failed to parse saved assignments', error);
      }
    }
    
    if (savedTests) {
      try {
        const parsedTests = JSON.parse(savedTests);
        const testsWithDates = parsedTests.map((test: any) => ({
          ...test,
          date: new Date(test.date)
        }));
        setTests(testsWithDates);
      } catch (error) {
        console.error('Failed to parse saved tests', error);
      }
    }
    
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        const projectsWithDates = parsedProjects.map((project: any) => ({
          ...project,
          dueDate: new Date(project.dueDate),
          milestones: project.milestones.map((milestone: any) => ({
            ...milestone,
            dueDate: new Date(milestone.dueDate)
          }))
        }));
        setProjects(projectsWithDates);
      } catch (error) {
        console.error('Failed to parse saved projects', error);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('studentClasses', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('studentAssignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('studentTests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('studentProjects', JSON.stringify(projects));
  }, [projects]);

  const addClass = (newClass: Omit<Class, 'id'>) => {
    const classWithId = {
      ...newClass,
      id: crypto.randomUUID(),
    };
    setClasses(prev => [...prev, classWithId]);
    toast({
      title: "Class added",
      description: `"${newClass.name}" has been added to your classes.`,
    });
  };

  const updateClass = (updatedClass: Class) => {
    setClasses(prev => prev.map(cls => 
      cls.id === updatedClass.id ? updatedClass : cls
    ));
    toast({
      title: "Class updated",
      description: `"${updatedClass.name}" has been updated.`,
    });
  };

  const deleteClass = (classId: string) => {
    const classToDelete = classes.find(c => c.id === classId);
    setClasses(prev => prev.filter(cls => cls.id !== classId));
    
    // Also delete all assignments, tests, and projects for this class
    setAssignments(prev => prev.filter(a => a.classId !== classId));
    setTests(prev => prev.filter(t => t.classId !== classId));
    setProjects(prev => prev.filter(p => p.classId !== classId));
    
    if (classToDelete) {
      toast({
        title: "Class deleted",
        description: `"${classToDelete.name}" and its associated items have been removed.`,
      });
    }
  };

  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const assignmentWithId = {
      ...assignment,
      id: crypto.randomUUID(),
    };
    setAssignments(prev => [...prev, assignmentWithId]);
    toast({
      title: "Assignment added",
      description: `"${assignment.title}" has been added to your assignments.`,
    });
  };

  const updateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === updatedAssignment.id ? updatedAssignment : assignment
    ));
    toast({
      title: "Assignment updated",
      description: `"${updatedAssignment.title}" has been updated.`,
    });
  };

  const deleteAssignment = (assignmentId: string) => {
    const assignmentToDelete = assignments.find(a => a.id === assignmentId);
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
    
    if (assignmentToDelete) {
      toast({
        title: "Assignment deleted",
        description: `"${assignmentToDelete.title}" has been removed.`,
      });
    }
  };

  const toggleAssignmentCompletion = (assignmentId: string) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, completed: !assignment.completed } 
        : assignment
    ));
  };

  const addTest = (test: Omit<Test, 'id'>) => {
    const testWithId = {
      ...test,
      id: crypto.randomUUID(),
    };
    setTests(prev => [...prev, testWithId]);
    toast({
      title: "Test added",
      description: `"${test.title}" has been added to your tests.`,
    });
  };

  const updateTest = (updatedTest: Test) => {
    setTests(prev => prev.map(test => 
      test.id === updatedTest.id ? updatedTest : test
    ));
    toast({
      title: "Test updated",
      description: `"${updatedTest.title}" has been updated.`,
    });
  };

  const deleteTest = (testId: string) => {
    const testToDelete = tests.find(t => t.id === testId);
    setTests(prev => prev.filter(test => test.id !== testId));
    
    if (testToDelete) {
      toast({
        title: "Test deleted",
        description: `"${testToDelete.title}" has been removed.`,
      });
    }
  };

  const toggleTestCompletion = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, completed: !test.completed } 
        : test
    ));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const projectWithId = {
      ...project,
      id: crypto.randomUUID(),
    };
    setProjects(prev => [...prev, projectWithId]);
    toast({
      title: "Project added",
      description: `"${project.title}" has been added to your projects.`,
    });
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
    toast({
      title: "Project updated",
      description: `"${updatedProject.title}" has been updated.`,
    });
  };

  const deleteProject = (projectId: string) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    if (projectToDelete) {
      toast({
        title: "Project deleted",
        description: `"${projectToDelete.title}" has been removed.`,
      });
    }
  };

  const toggleProjectCompletion = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, completed: !project.completed } 
        : project
    ));
  };

  const toggleProjectMilestoneCompletion = (projectId: string, milestoneIndex: number) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;
      
      const updatedMilestones = [...project.milestones];
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        completed: !updatedMilestones[milestoneIndex].completed
      };
      
      return {
        ...project,
        milestones: updatedMilestones
      };
    }));
  };

  const getClassById = (classId: string) => {
    return classes.find(cls => cls.id === classId);
  };

  return (
    <StudentContext.Provider
      value={{
        classes,
        assignments,
        tests,
        projects,
        addClass,
        updateClass,
        deleteClass,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleAssignmentCompletion,
        addTest,
        updateTest,
        deleteTest,
        toggleTestCompletion,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectCompletion,
        toggleProjectMilestoneCompletion,
        getClassById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
