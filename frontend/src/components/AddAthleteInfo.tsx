// register.tsx（Reactコンポーネントとして作成）
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const AddAthleteInfo: React.FC = () => {
  const { user, userData, logout, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  interface AthleteData {
    学連登録番号: string;
    県登録番号: number | null;
    姓: string;
    名: string;
    姓カナ: string;
    名カナ: string;
    所属陸協: string;
    性別: string;
    学年: string;
    陸連ナンバー: number;
  }
  const [athleteData, setAthleteData] = useState({
    学連登録番号: '',
    県登録番号: undefined,
    姓: '',
    名: '',
    姓カナ: '',
    名カナ: '',
    所属陸協: '',
    性別: '',
    学年: '',
    陸連ナンバー: undefined,
  });

  const sexOptions = ['男', '女'];
  const gradeOptions = [
    '1', '2', '3', '4', '5', '6',
    'M1', 'M2', 'D1', 'D2', 'D3'
  ];

  // ログインしていない場合、ホームにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAthleteData({
      ...athleteData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullEmail = email + '@kadai.jp';
    try {
      // ユーザーの作成
      const userCredential = await createUserWithEmailAndPassword(auth, fullEmail, password);
      const uid = userCredential.user.uid;
      // Firestoreに選手情報を登録
      await setDoc(doc(db, 'users', uid), {
        fullEmail,
        ...athleteData,
      });

      alert('選手情報が登録されました！');
    } catch (error) {
      console.error('エラーが発生しました:', error);
      alert('エラーが発生しました');
    }
  };

  return (
    <div className="vh-100 base-background-color">
      <div className="container-flex d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-lg-8 max-height">
          <div className="rounded-4 bg-white p-4 m-4">
            <div className="d-flex justify-content-between mb-">
              <button onClick={() => navigate(`/home`)} className="btn bi bi-arrow-left">
                戻る
              </button>
              <button onClick={logout} className="btn btn-danger btn-sm rounded-2 text-white px-2 py-2">
                ログアウト
              </button>
            </div>
            <h2 className="fs-1 text-center fw-bolder mb-4">部員の登録</h2>
            <div className="d-flex justify-content-end">
              {userData ? (
                <p>ログイン中<br/>{userData.lastName} {userData.firstName}</p>
              ) : (
                <p>ユーザデータを取得中...</p>
              )}
            </div>
            <div className="d-flex justify-content-between mb-4">
              {/* <button 
                className='btn btn-primary btn-sm p-2'
                onClick={() => navigate(`/competition-entry/${competitionId}/entries`)}
              >
                一覧を表示
              </button> */}
            </div>
            <p className='fs-2'>新規登録</p>
              <form onSubmit={handleRegister}>
                <div className="row g-3">
                  <div className='col-md-6 form-group mb-3'>
                    <label>メールアドレス</label>
                    <div className='input-group'>
                      <input
                        className='form-control'
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <span className="input-group-text">@kadai.jp</span>
                    </div>
                  </div>
                  <div className="col-md-6 form-froup mb-3">
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
                  </div>
                </div>

                {/* 選手情報の登録フォーム */}
                <p className='fs-2 mt-5'>選手情報</p>
                <div className="row g-3">
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>姓</label>
                    <input
                      className='form-control'
                      type="text"
                      name="姓"
                      value={athleteData.姓}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>名</label>
                    <input
                      className='form-control'
                      type="text"
                      name="名"
                      value={athleteData.名}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>姓（カナ）</label>
                    <input
                      className='form-control'
                      type="text"
                      name="姓カナ"
                      value={athleteData.姓カナ}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>名（カナ）</label>
                    <input
                      className='form-control'
                      type="text"
                      name="名カナ"
                      value={athleteData.名カナ}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>学連登録番号</label>
                    <input
                      className='form-control'
                      type="text"
                      name="学連登録番号"
                      value={athleteData.学連登録番号}
                      onChange={handleInputChange}
                      placeholder="記録を入力"
                      required
                    />
                  </div>
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>県登録番号</label>
                    <input
                      className='form-control'
                      type="text"
                      name="県登録番号"
                      value={athleteData.県登録番号}
                      onChange={handleInputChange}
                      placeholder="記録を入力"
                      required
                    />
                  </div>
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>陸連ナンバー</label>
                    <input
                      className='form-control'
                      type="text"
                      name="陸連ナンバー"
                      value={athleteData.陸連ナンバー}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>所属陸協</label>
                    <input
                      className='form-control'
                      type="text"
                      name="所属陸協"
                      value={athleteData.所属陸協}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>性別</label>
                    <input
                      className='form-control'
                      type="text"
                      name="性別"
                      value={athleteData.性別}
                      onChange={handleInputChange}
                      required
                    />  
                  </div>
                  <div className="form-group mb-1 col-12 col-md-6">
                    <label>学年</label>
                    <input
                      className='form-control'
                      type="text"
                      name="学年"
                      value={athleteData.学年}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </form>
              <button className='col-12 btn btn-primary mt-5' type="submit" onClick={handleRegister}>登録</button>
            </div>
          </div>
        </div>
      </div>

  );
};

export default AddAthleteInfo;
