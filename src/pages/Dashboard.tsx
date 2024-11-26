import { useAuthStore } from '../store/authStore';
import { LogOut, BookOpen, Star, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockExams = [
  {
    id: 1,
    title: "Mathematics Final",
    duration: "2 hours",
    questions: 50,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Physics Midterm",
    duration: "1.5 hours",
    questions: 40,
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Chemistry Quiz",
    duration: "45 minutes",
    questions: 25,
    image: "https://images.unsplash.com/photo-1603126957883-239cc6ad492c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
];

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">Exam Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex space-x-4 mb-8">
            <div className="flex-1 bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Available Tests</h3>
                  <p className="text-gray-500">3 tests waiting</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Your Score</h3>
                  <p className="text-gray-500">85% average</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockExams.map((exam) => (
              <Link
                key={exam.id}
                to={`/exam/${exam.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={exam.image}
                  alt={exam.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{exam.title}</h3>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Duration: {exam.duration}</span>
                    <span>{exam.questions} questions</span>
                  </div>
                  <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200">
                    Start Exam
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}