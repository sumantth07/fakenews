import { useState } from 'react';
import { Hero } from './components/Hero';
import { Scanner } from './components/Scanner';
import { Footer } from './components/Footer';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { Architecture } from './components/Architecture';

export default function App() {
  const [result, setResult] = useState(null);
  return (
    <div className="bg-black text-white noise flex flex-col gap-0">
      <Hero />
      <Scanner onResult={setResult} />
      <AnalysisDashboard result={result} />
      <Architecture />
      <Footer />
    </div>
  );
}
