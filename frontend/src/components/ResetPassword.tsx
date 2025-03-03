import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailAddress = email + "@kadai.jp";
    try {
      await sendPasswordResetEmail(auth, emailAddress);
      alert(emailAddress + '　にパスワードリセット用のメールを送信しました');
      navigate('/');
    } catch (error) {
      alert('メール送信に失敗しました');
    }
  }

  return (
    <div className="vh-100 base-background-color">
    <div className="mx-3 container-flex d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 rounded-4 bg-white">
        <button onClick={() => {navigate("/")}} className='btn bi bi-arrow-left mb-2'> 戻る</button>
        <h2 className="text-center fw-bolder mb-4">パスワードの再設定</h2>
        <form onSubmit={handlePasswordReset}>
          <div className="form-group mb-5">
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
          <button type='submit' className='col-12 btn btn-primary btn-block'>メールを送信</button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default ResetPassword
