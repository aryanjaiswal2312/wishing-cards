import { Route, Routes } from 'react-router-dom';
import { Particles } from '@/components/Particles';
import BuilderPage from '@/pages/BuilderPage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import ViewerPage from '@/pages/ViewerPage';

export default function App() {
  return (
    <>
      <Particles />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<BuilderPage />} />
        <Route path="/view/:id" element={<ViewerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
