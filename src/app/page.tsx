import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import HomePage from '@/components/Home/HomePage';

const Home = () => {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
};

export default Home;
