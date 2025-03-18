import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import "../App.css";

const AddCompetition: React.FC = () => {
  const { user, userData } = useAuth();
  const [competitionName, setCompetitionName] = useState('');
  const navigate = useNavigate();

  // 管理者以外はリダイレクト
  useEffect(() => {
    if (!userData?.isAdmin) {
      navigate("/home");
    }
  }, [userData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("認証情報がありません。ログインし直してください。");
      return;
    }

    if (!competitionName) {
      alert("大会名を入力してください");
      return;
    }

    try {
      const newCompetitionRef = await addDoc(collection(db, "competitions"), {
        name: competitionName,
      });  
      // Firestoreに大会を追加
      const athleteSubCollectionRef = collection(newCompetitionRef, "athletes");

      await addDoc(athleteSubCollectionRef, {
      });

      alert("大会が追加されました");
      navigate("/competitions");
    } catch (error) {
      console.error("大会の追加エラー:", error);
      alert("大会の追加に失敗しました");
    }
  };

  return (
    <div className="vh-100 base-background-color">
      <div className="mx-3 container-flex d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-sm-8 rounded-4 bg-white p-4">
          <button onClick={() => navigate("/competitions")} className='btn bi bi-arrow-left'>
            &nbsp;戻る
          </button>
          <h2 className="text-center fw-bolder">大会の追加</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="competitionName">大会名</label>
              <input
                type="text"
                id="competitionName"
                className="form-control"
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block col-12">大会を追加</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompetition;
