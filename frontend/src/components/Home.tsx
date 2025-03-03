import React, { useEffect } from 'react'
import{ useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import "../App.css";

const Home: React.FC = () => {
  const { user, userData, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  return (
    <div className="vh-100 base-background-color">
      <div className="mx-3 container-flex d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-sm-8 rounded-4 bg-white p-4">
          <div className="col text-end mb-4">
            <button onClick={logout} className="btn btn-danger btn-sm rounded-2 text-white px-2 py-2">
              ログアウト
            </button>
          </div>
          <h2 className="text-center fw-bolder">鹿大陸部専用やで</h2>
            <div className="row d-flex align-items-end mb-4">
              <div className="col text-end">
                {userData ? (
                  <p>ログイン中<br/>{userData.lastName} {userData.firstName}</p>
                ) : (
                  <p>ユーザデータを取得中...</p>
                )}
              </div>
            </div>
          <div className="row">
            <div className="col-6">
              <button onClick={() => navigate('/competitions')} className="btn button-shade rounded-0 w-100 pt-3">
                <img src="./images/home_dash.png" className="register-logo" alt="" />
                <p className="mt-3">大会の登録</p>
              </button>
            </div>
            <div className="col-6">
              <button className="btn button-shade rounded-0 w-100 pt-3" disabled>
                <img src="./images/home_documents.png" className="register-logo" alt="" />
                <p className="mt-3">過去の記録（作成中）</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
