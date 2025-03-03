// EditCompetition.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import "../App.css";

const EditCompetition: React.FC = () => {
  const { competitionId } = useParams();
  const [competitionName, setCompetitionName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const docRef = doc(db, "competitions", competitionId || "");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompetitionName(docSnap.data().name);
        } else {
          alert("大会が見つかりません");
        }
      } catch (error) {
        alert("大会の取得に失敗しました");
      }
    };
    fetchCompetition();
  }, [competitionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "competitions", competitionId || "");
      await updateDoc(docRef, {
        name: competitionName
      });
      alert("大会名が更新されました");
      navigate("/competitions");
    } catch (error) {
      alert("大会名の更新に失敗しました");
    }
  };

  return (
    <div className="vh-100 base-background-color">
      <div className="mx-3 container-flex d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-sm-8 rounded-4 bg-white p-4">
          <button onClick={() => { navigate("/competitions") }} className="btn bi bi-arrow-left"> 戻る</button>
          <h2 className="text-center fw-bolder">大会名を編集</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="competitionName">大会名</label>
              <input
                type="text"
                className="form-control"
                id="competitionName"
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block w-100">保存</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCompetition;
