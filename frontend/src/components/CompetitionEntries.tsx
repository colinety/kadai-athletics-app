import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, setDoc, doc, deleteDoc, getDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const CompetitionEntry: React.FC = () => {
  const { user, userData, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { competitionId } = useParams();
  const [competitionName, setCompetitionName] = useState<string | null>(null);
  const [events, setEvents] = useState<{ event: string; record: string }[]>([
    { event: '', record: '' },
  ]);
  const [athletes, setAthletes] = useState<{ name: string; events: { event: string; record: string }[] }[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!competitionId) return;
      try {
        const competitionRef = doc(db, "competitions", competitionId);
        const competitionSnap = await getDoc(competitionRef);
        if (competitionSnap.exists()) {
          setCompetitionName(competitionSnap.data().name);
        } else {
          setCompetitionName("大会情報が見つかりません");
        }
      } catch (error) {
        console.error("大会情報の取得エラー:", error);
        setCompetitionName("大会情報の取得に失敗しました");
      }
    };
    fetchCompetition();
  }, [competitionId]);

  useEffect(() => {
    const fetchAthletes = async () => {
      if (!competitionId) return;
      try {
        const athletesRef = collection(db, 'competitions', competitionId, 'athletes');
        const athletesSnapshot = await getDocs(athletesRef);
        const athleteList = athletesSnapshot.docs.map(doc => ({
          name: doc.data().athleteName,
          events: doc.data().events || [],
        }));
        setAthletes(athleteList);
      } catch (error) {
        console.error("選手データの取得エラー:", error);
      }
    };
    fetchAthletes();
  }, [competitionId]);

  return (
    <div className="vh-100 base-background-color">
      <div className="mx-3 container-flex d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-sm-8 max-height">
          <div className="rounded-4 bg-white p-4">
            <div className="d-flex justify-content-between mb-4">
              <button onClick={() => navigate(`/competitions`)} className="btn bi bi-arrow-left">
                戻る
              </button>
              <button onClick={logout} className="btn btn-danger btn-sm rounded-2 text-white px-2 py-2">
                ログアウト
              </button>
            </div>
            <h2 className="text-center fw-bolder mb-4">{competitionName ? competitionName : "大会情報を取得中..."}<br/>種目の登録</h2>
            <div className="d-flex justify-content-end">
              {userData ? (
                <p>ログイン中<br/>{userData.lastName} {userData.firstName}</p>
              ) : (
                <p>ユーザデータを取得中...</p>
              )}
            </div>
            <div className='table-scroll'>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>選手名</th>
                    <th>種目</th>
                    <th>記録</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.length > 0 ? (
                    athletes.map((athlete, index) => (
                      athlete.events.map((event, idx) => (
                        <tr key={`${index}-${idx}`}>
                          {idx === 0 && <td rowSpan={athlete.events.length}>{athlete.name}</td>}
                          <td>{event.event}</td>
                          <td>{event.record}</td>
                        </tr>
                      ))
                    ))
                  ) : (
                    <tr><td colSpan={3} className="text-center">登録された選手がいません</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionEntry;
