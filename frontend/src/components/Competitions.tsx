import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import "../App.css";
import "bootstrap-icons/font/bootstrap-icons.css";


const Competitions: React.FC = () => {
  const { user, userData, logout, loading } = useAuth();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);
  

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const competitionsSnapshot = await getDocs(collection(db, "competitions"));
        const competitionsList = competitionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setCompetitions(competitionsList);
      } catch (error) {
      }
    };
    fetchCompetitions();
  }, []);

  return (
    <div className="vh-100 base-background-color">
      <div className="mx-3 container-flex d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-md-8 col-lg-6 max-height">
          <div className="rounded-4 bg-white p-4">
            <div className="col d-flex justify-content-between mb-4">
              <button onClick={() => {navigate("/home")}} className='btn bi bi-arrow-left'> 戻る</button>
              <button onClick={logout} className="btn btn-danger btn-sm rounded-2 text-white px-2 py-2">
                ログアウト
              </button>
            </div>
            <h2 className="text-center fw-bolder mb-4">大会登録</h2>
            <div className="col d-flex justify-content-between mb-4">
              {/* 管理者のみ「大会の追加」ボタンを表示 */}
              {userData?.isAdmin && (
                <button onClick={() => navigate('/add-competition')} className="btn rounded add-competition-btn bi bi-plus-lg"> 大会を追加する</button>
              )}
              <div className="col text-end">
                {userData ? (
                  <p>ログイン中<br/>{userData.lastName} {userData.firstName}</p>
                ) : (
                  <p>ユーザデータを取得中...</p>
                )}
              </div>
            </div>
            {competitions.length > 0 ? (
              competitions.map((competition: any) => (
                <div className="mb-3">
                  <div className="col">
                    <button key={competition.id} onClick={() => navigate(`/competition-entry/${competition.id}`)} className="btn button-shade rounded-0 w-100 pt-3">
                      <p className='fs-4'>{competition.name}</p>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>現在、登録可能な大会がありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Competitions
