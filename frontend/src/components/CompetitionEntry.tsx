import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, setDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const CompetitionEntry: React.FC = () => {
  const { user, userData, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { competitionId } = useParams();
  const [competitionName, setCompetitionName] = useState<string | null>(null);
  const [events, setEvents] = useState<{ event: string; record: string }[]>([
    { event: '', record: '' },
  ]);

  // ログインしていない場合、ホームにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // 大会情報を取得
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
    const fetchUserEntry = async () => {
      if (!competitionId || !user || !userData) return;
      try {
        const athleteRef = doc(db, 'competitions', competitionId, 'athletes');
        const athleteQuerySnapshot = await getDoc(athleteRef);
        if (athleteQuerySnapshot.exists()) {
          setEvents(athleteQuerySnapshot.data().events);
        }
      } catch (error) {
        console.error('エントリー情報の取得エラー:', error);
      }
    };
    fetchUserEntry();
  }, [competitionId, user, userData]);
        

  // 新しい種目と記録を追加する
  const handleAddEvent = () => {
    setEvents([...events, { event: '', record: '' }]); // 新しい入力フィールドを追加
  };

  // 種目を削除
  const handleRemoveEvent = async (index: number) => {
    if (events.length === 1) {
      alert("最低1つの種目は必要です。");
      return;
    }
  
    // ローカル状態から種目を削除
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  
    if (!competitionId || !user || !userData) return;
  
    try {
      // Firestore内の選手のドキュメントを取得
      const athleteRef = doc(db, 'competitions', competitionId, 'athletes', `${userData.lastName}${userData.firstName}`);
      
      // Firestoreの選手データを更新
      await setDoc(athleteRef, {
        athleteName: `${userData.lastName}${userData.firstName}`,
        events: updatedEvents, // 削除後の種目リストを設定
      });
  
    } catch (error) {
      console.error('Firestore 更新エラー:', error);
      alert('種目の削除に失敗しました');
    }
  };

  // 入力フィールドの変更を管理
  const handleEventChange = (index: number, field: 'event' | 'record', value: string) => {
    const updatedEvents = [...events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setEvents(updatedEvents);
  };

  // 大会を削除
  const handleDeleteCompetition = async (competitionId: string) => {
    if (!competitionId) return;
    if (!window.confirm('本当にこの大会を削除しますか？')) return;
    try {
      await deleteDoc(doc(db, 'competitions', competitionId));
      navigate('/competitions');
    } catch (error) {
    }};

  // 競技種目の選択肢
  const eventOptions = [
    "100m", "200m", "400m", "800m",
    "1500m", "5000m", "10000m",
    "110mH", "400mH", "3000mSC",
    "走幅跳", "三段跳", "走高跳", "棒高跳",
    "砲丸投", "円盤投", "ハンマー投", "やり投",
    "十種競技"
  ];
  
  // フォームの送信処理（Firestoreへの登録）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('認証情報がありません。ログインし直してください。');
      return;
    }
    if (!userData || !userData.firstName || !userData.lastName) {
      alert('ユーザデータが不正です');
      return;
    }
    // 同じ種目が複数回選ばれているかをチェック
    const eventNames = events.map(event => event.event);
    const duplicateEvent = eventNames.some((event, index) => eventNames.indexOf(event) !== index);
    
    if (duplicateEvent) {
      alert('種目が重複しています');
      return;
    }

    try {
      // 競技大会IDが存在することを確認
      if (!competitionId) {
        alert('大会IDが無効です');
        return;
      }

      // Firestoreの競技大会と選手情報のサブコレクションにデータを追加
      const athleteRef = collection(db, 'competitions', competitionId, 'athletes');
      const athleteFullName = userData?.lastName + userData?.firstName;

      const athleteDocRef = doc(athleteRef, athleteFullName);
      await setDoc(athleteDocRef, {
        athleteName: athleteFullName, // 選手名
        events: events, // 入力された種目と記録
      });

      const competitionEntryRef = doc(db, 'competitions', competitionId, 'entries', user.uid);
      // const userEntryRef = doc(db, 'users', user.uid);
      // await setDoc(userEntryRef, { events });
      await setDoc(competitionEntryRef, { userId: user.uid });

      // const athleteRef = collection(db, 'competitions', competitionId, 'athletes');
      // const athleteId = user.uid;
      // const athleteDocRef = doc(athleteRef, athleteId);
      // await setDoc(athleteDocRef, {
      //   athleteId: athleteId, // 選手名
      //   events: events, // 入力された種目と記録
      // });

      navigate(`/competitions`);
    } catch (error) {
      alert('登録に失敗しました');
    }
  };

  return (
    <div className="min-vh-100 base-background-color">
      <div className="container-flex d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-lg-8 max-height">
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
            <div className="d-flex justify-content-end text-end">
              {userData ? (
                <p>ログイン中<br/>{userData.lastName} {userData.firstName}</p>
              ) : (
                <p>ユーザデータを取得中...</p>
              )}
            </div>
            <div className="d-flex justify-content-between mb-4">
              {userData?.isAdmin && (
                <button onClick={() => handleDeleteCompetition(competitionId!)} className="btn btn-danger btn-sm p-2 rounded-2 text-white">この大会を削除</button>
              )}
              <button 
                className='btn btn-primary btn-sm p-2'
                onClick={() => navigate(`/competition-entry/${competitionId}/entries`)}
              >
                一覧を表示
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {events.map((event, index) => (
                <div className="form-group mb-4" key={index}>
                  <div className="event-register-box border border-2 border-black rounded-3 p-3">
                    <p className='fs-5 event-register px-2'>種目 {index + 1}</p>
                    <div className=" d-flex justify-content-end">
                      <button
                        type="button"
                        className='btn btn-outline-danger btn-sm rounded-2'
                        onClick={() => handleRemoveEvent(index)}
                      >
                        種目を削除
                      </button>
                    </div>
                    <label htmlFor={`event-${index}`}>種目名</label>
                    <select
                      id={`event-${index}`}
                      className="form-control mb-2"
                      value={event.event}
                      onChange={(e) => handleEventChange(index, 'event', e.target.value)}
                      required
                    >
                      <option value="">種目を選択</option>
                      {eventOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                    <label htmlFor={`time-${index}`}>記録</label>
                    <input
                      type="text"
                      id={`time-${index}`}
                      className="form-control mb-2"
                      placeholder="記録を入力"
                      value={event.record}
                      onChange={(e) => handleEventChange(index, 'record', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={handleAddEvent} className="btn btn-outline-primary btn-sm p-2 mb-4 bi bi-plus-lg"> 種目を追加</button>
              <button type="submit" className="btn btn-primary btn-block col-12">
                登録
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionEntry;