import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const mockQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: 1
  }
];

export default function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(mockQuestions.length).fill(-1));
  const [reviewedQuestions, setReviewedQuestions] = useState<boolean[]>(new Array(mockQuestions.length).fill(false));
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const score = answers.reduce((acc, answer, index) => {
      return answer === mockQuestions[index].correct ? acc + 1 : acc;
    }, 0);

    // Show results
    const results = document.getElementById('results');
    if (results) {
      results.innerHTML = `
        <h2>Your Score: ${score}/${mockQuestions.length}</h2>
        ${mockQuestions.map((q, i) => `
          <div class="result-box">
            <p>Question ${i + 1}: ${q.question}</p>
            <p>Your answer: ${answers[i] === -1 ? 'Not attempted' : q.options[answers[i]]}</p>
            <p>Correct answer: ${q.options[q.correct]}</p>
          </div>
        `).join('')}
      `;
    }

    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const markForReview = () => {
    const newReviewedQuestions = [...reviewedQuestions];
    newReviewedQuestions[currentQuestion] = !newReviewedQuestions[currentQuestion];
    setReviewedQuestions(newReviewedQuestions);
  };

  const getQuestionStatus = (index: number) => {
    if (reviewedQuestions[index]) return 'review';
    if (answers[index] !== -1) return 'answered';
    return 'unanswered';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Timer and Exam Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Exam #{id}</h1>
          <div className="flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5 mr-2 text-indigo-600" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium mb-4">Question Navigation</h2>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {mockQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-full aspect-square rounded-lg text-sm font-medium flex items-center justify-center transition-colors
                      ${currentQuestion === index ? 'ring-2 ring-indigo-500' : ''}
                      ${getQuestionStatus(index) === 'review' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                        getQuestionStatus(index) === 'answered' ? 'bg-green-100 text-green-700 border-green-300' :
                        'bg-gray-100 text-gray-700 border-gray-300'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded mr-2"></div>
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                  <span>Not Answered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question and Options */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Question {currentQuestion + 1}</h2>
                  <button
                    onClick={markForReview}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center
                      ${reviewedQuestions[currentQuestion] 
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {reviewedQuestions[currentQuestion] ? 'Marked for Review' : 'Mark for Review'}
                  </button>
                </div>

                <p className="text-gray-900 text-lg mb-6">{mockQuestions[currentQuestion].question}</p>

                <div className="space-y-3">
                  {mockQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors
                        ${answers[currentQuestion] === index
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>

                {currentQuestion === mockQuestions.length - 1 ? (
                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion((prev) => Math.min(mockQuestions.length - 1, prev + 1))}
                    className="flex items-center px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Exam?</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to submit your exam? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section (Hidden initially) */}
      <div id="results" className="hidden"></div>
    </div>
  );
}