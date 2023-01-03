import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NotFound from './components/NotFound';
import Test from './components/Test';
import { TestLogin } from './components/member/TestLogin';
import { TestJoin } from './components/member/TestJoin';
import { TestMyInfo } from './components/member/TestMyInfo';
import TestTwitList from './components/twit/TestTwitList';
import { TestTwitDetail } from './components/twit/TestTwitDetail';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
				<Routes>
					<Route path="/" element={<Test />}></Route>
          <Route path="/testJoin" element={<TestJoin />}></Route>
          <Route path="/testLogin" element={<TestLogin />}></Route>
          <Route path="/testMyInfo" element={<TestMyInfo />}></Route>
          <Route path="/testTwitList" element={<TestTwitList />}></Route>
          <Route path="/testTwitDetail" element={<TestTwitDetail />}></Route>
          {/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</BrowserRouter>
    </div>
  );
}

export default App;
