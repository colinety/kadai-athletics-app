// register.tsx（Reactコンポーネントとして作成）
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const AllMembers: React.FC = () => {
  const { user, userData, logout, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const navigate = useNavigate();


  // ログインしていない場合、ホームにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMembers(membersList);      
      } catch (error) {
        console.error("部員データの取得エラー:", error);
      }
    };
    fetchMembers();
  }, []);
  
  return (
    <div className="min-vh-100 base-background-color">
      <div className="container-flex d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-lg-8 max-height">
          <div className="rounded-4 bg-white p-4 m-4">
            <div className="d-flex justify-content-between mb-4">
              <button onClick={() => navigate(`/home`)} className="btn bi bi-arrow-left">
                &nbsp;戻る
              </button>
              <button onClick={logout} className="btn btn-danger btn-sm rounded-2 text-white px-2 py-2">
                ログアウト
              </button>
            </div>
            <h2 className="fs-1 text-center fw-bolder mb-4">部員一覧</h2>
            <div className="d-flex justify-content-end text-end">
              {userData ? (
                <p>ログイン中<br/>{userData.lastName} {userData.firstName}</p>
              ) : (
                <p>ユーザデータを取得中...</p>
              )}
            </div>
            <div className="d-flex justify-content-end mb-4">
              <button className='btn btn-primary btn-sm p-2 bi bi-plus-lg' onClick={() => navigate(`/add-member-info`)}>
                &nbsp;部員の登録
              </button>
            </div>
            <div className="table-scroll">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>姓</th>
                    <th>名</th>
                    <th>姓(カナ)</th>
                    <th>名(カナ)</th>
                    <th>性別</th>
                    <th>学年</th>
                    <th>登録陸協</th>
                    <th>学連番号</th>
                    <th>県登録番号</th>
                    <th>JAAF番号</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {members.length > 0 ? (
                    members.map(member => (
                      <tr className='align-middle' key={member.id}>
                        <td>{member.lastName}</td>
                        <td>{member.firstName}</td>
                        <td>{member.lastNameKana}</td>
                        <td>{member.firstNameKana}</td>
                        <td>{member.sex}</td>
                        <td>{member.grade}</td>
                        <td>{member.association}</td>
                        <td>{member.gakurenNumber}</td>
                        <td>{member.associationNumber}</td>
                        <td>{member.jaafNumber}</td>
                        <td>
                          <button onClick={() => navigate(`/correction-member-info/${member.id}`)} className='btn btn-sm btn-correction'>修正</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">データがありません</td>
                    </tr>
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

export default AllMembers;
