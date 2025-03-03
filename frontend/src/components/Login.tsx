import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email + "@kadai.jp", password);   
      navigate('/home')
    } catch (error) {
      alert('メールアドレスもしくはパスワードが間違っています');
    }
  };

  const handlePasswordReset = async () => {
    navigate('/reset-password');
  }
  

  return (
    <div className="vh-100 base-background-color">
      <div className="mx-3 container-flex d-flex justify-content-center align-items-center vh-100">
        <div className="p-4 rounded-4 bg-white">
          <h2 className="text-center fw-bolder mb-5">ログイン</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="email">メールアドレス</label>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  id="email" 
                  placeholder="k1234567"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="input-group-text">@kadai.jp</span>
              </div>
              <div className="form-text">メールアドレスはkから始まるものを使用してください</div>
            </div>
            <div className="form-group mb-5">
              <label htmlFor="password">パスワード</label>
              <input 
                type='password'
                className="form-control" 
                id="password" 
                placeholder="パスワードを入力" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="form-text">パスワードを忘れたときは<button type="button" className='btn btn-link' onClick={handlePasswordReset}>こちら</button>から</div>
            </div>
            <button type='submit' className='col-12 btn btn-primary btn-block'>ログイン</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
