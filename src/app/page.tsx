import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import HomePage from '@/components/HomePage';

const Home = () => {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
};

export default Home;
