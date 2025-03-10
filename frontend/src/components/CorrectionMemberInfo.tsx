import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const CorrectionMemberInfo: React.FC = () => {
  const { user, userData, logout, loading } = useAuth();
  const [memberInfo, setMemberInfo] = useState<any[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  interface MemberData {
    gakurenNumber: string | null;
    associationNumber: number | null;
    lastName: string;
    firstName: string;
    lastNameKana: string;
    firstNameKana: string;
    association: string;
    sex: string;
    grade: string;
    jaafNumber: number | null;
    isAdmin: boolean;
  }
  const [memberData, setMemberData] = useState<MemberData>({
    gakurenNumber: '',
    associationNumber: null,
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    association: '',
    sex: '',
    grade: '',
    jaafNumber: null,
    isAdmin: false,
  });

  const associationOptions = [
    '北海道', '青森', '岩手', '宮城', '秋田',
    '山形', '福島', '茨城', '栃木', '群馬',
    '埼玉', '千葉', '東京', '神奈川', '新潟',
    '富山', '石川', '福井', '山梨', '長野',
    '岐阜', '静岡', '愛知', '三重', '滋賀',
    '京都', '大阪', '兵庫', '奈良', '和歌山',
    '鳥取', '島根', '岡山', '広島', '山口',
    '徳島', '香川', '愛媛', '高知', '福岡',
    '佐賀', '長崎', '熊本', '大分', '宮崎',
    '鹿児島', '沖縄'
  ];
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

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!id) return;
      try {
        const memberRef = doc(db, 'users', id);
        const memberSnap = await getDoc(memberRef);
        if (memberSnap.exists()) {
          setMemberData(memberSnap.data() as MemberData);
        }
      } catch (error) {
        console.error('部員情報の取得エラー:', error);
      }
    }
    fetchMemberData();
  }, [id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setMemberData((prevData) => ({
      ...prevData,
      [name]: ['prefectureNumber', 'jaafNumber'].includes(name)
      ? value ? parseInt(value, 10) || null : null
      : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const docRef = doc(db, 'users', id || '');
      await setDoc(docRef, memberData, { merge: true }); 
      navigate('/all-members');  
    } catch (error) {
      console.error("Error updating member data:", error);
    }
  };

  return (
    <div className="vh-100 base-background-color">
      <div className="container-flex d-flex justify-content-center align-items-center vh-100">
        <div className="col-12 col-lg-8 max-height">
          <div className="rounded-4 bg-white p-4 m-4">
            <div className="d-flex justify-content-between mb-4">
              <button onClick={() => navigate(`/all-members`)} className="btn bi bi-arrow-left">
                &nbsp;戻る
              </button>
              <button onClick={logout} className="btn btn-danger btn-sm rounded-2 text-white px-2 py-2">
                ログアウト
              </button>
            </div>
            <h2 className="fs-1 text-center fw-bolder mb-4">部員情報の修正</h2>
            <div className="d-flex justify-content-end text-end">
              {userData ? (
                <p>ログイン中<br/>{userData.lastName} {userData.firstName}</p>
              ) : (
                <p>ユーザデータを取得中...</p>
              )}
            </div>
            <form>
              {/* 部員情報の登録フォーム */}
              <p className='fs-2 mt-5'>部員情報</p>
              <div className="row g-3">
                <div className="form-group mb-1 col-12 col-md-6">
                  <label>姓</label>
                  <input
                    className='form-control'
                    type="text"
                    name="lastName"
                    value={memberData.lastName}
                    placeholder='山田'
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group mb-1 col-12 col-md-6">
                  <label>名</label>
                  <input
                    className='form-control'
                    type="text"
                    name="firstName"
                    value={memberData.firstName}
                    placeholder='太郎'
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group mb-1 col-12 col-md-6">
                  <label>姓（カナ）</label>
                  <input
                    className='form-control'
                    type="text"
                    name="lastNameKana"
                    value={memberData.lastNameKana}
                    placeholder='ヤマダ'
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group mb-1 col-12 col-md-6">
                  <label>名（カナ）</label>
                  <input
                    className='form-control'
                    type="text"
                    name="firstNameKana"
                    value={memberData.firstNameKana}
                    placeholder='タロウ'
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-1 col-12 col-md-6">
                  <label>性別</label>
                  <select className='form-select' name='sex' value={memberData.sex} onChange={handleInputChange} required>
                    <option value="">性別を選択</option>
                    {sexOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-1 col-12 col-md-6">
                  <label>学年</label>
                  <select className='form-select' name='grade' value={memberData.grade} onChange={handleInputChange} required>
                    <option value="">学年を選択</option>
                    {gradeOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-1 col-12 col-md-6">
                  <label>学連登録番号</label>
                  <input
                    className='form-control'
                    type="text"
                    name="gakurenNumber"
                    value={memberData.gakurenNumber ?? ''}
                    onChange={handleInputChange}
                    placeholder="8-000"
                  />
                </div>
                <div className="form-group mb-1 col-12 col-md-6">
                  <label>県登録番号</label>
                  <input
                    className='form-control'
                    type="text"
                    name="prefectureNumber"
                    value={memberData.associationNumber ?? ''}
                    onChange={handleInputChange}
                    placeholder="記録を入力"
                  />
                </div>
                <div className="form-group mb-1 col-12 col-md-6">
                  <label>JAAFナンバー</label>
                  <input
                    className='form-control'
                    type="text"
                    name="jaffNumber"
                    value={memberData.jaafNumber ?? ''}
                    placeholder='00000000'
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-1 col-12 col-md-6">
                  <label>所属陸協</label>
                  <select className='form-select' name='association' value={memberData.association} onChange={handleInputChange} required>
                    <option value=''>所属陸協を選択</option>
                    {associationOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
            <button className='col-12 btn btn-primary mt-5' onClick={handleSubmit}>登録</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectionMemberInfo;
