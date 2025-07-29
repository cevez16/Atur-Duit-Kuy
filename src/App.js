import React, { useEffect, useState } from "react";
import { auth, provider, db } from "./firebaseConfig";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState({ tanggal: "", kategori: "", deskripsi: "", jumlah: "" });
  const [catatan, setCatatan] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, "users", currentUser.uid, "catatan"), orderBy("tanggal"));
        onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCatatan(data);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSubmit = async () => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "catatan"), {
      ...input,
      jumlah: parseInt(input.jumlah),
      tanggal: input.tanggal
    });
    setInput({ tanggal: "", kategori: "", deskripsi: "", jumlah: "" });
  };

  const totalPengeluaran = catatan.reduce((acc, cur) => acc + cur.jumlah, 0);

  return (
    <div>
      <h1>Pengelola Keuangan Pribadi</h1>
      {!user ? (
        <button onClick={handleLogin}>Login dengan Google</button>
      ) : (
        <div>
          <p>Halo, {user.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <div>
        <h2>Input Catatan</h2>
        <input placeholder="Tanggal" value={input.tanggal} onChange={(e) => setInput({ ...input, tanggal: e.target.value })} />
        <input placeholder="Kategori" value={input.kategori} onChange={(e) => setInput({ ...input, kategori: e.target.value })} />
        <input placeholder="Deskripsi" value={input.deskripsi} onChange={(e) => setInput({ ...input, deskripsi: e.target.value })} />
        <input placeholder="Jumlah" type="number" value={input.jumlah} onChange={(e) => setInput({ ...input, jumlah: e.target.value })} />
        <button onClick={handleSubmit}>Simpan</button>
      </div>

      <div>
        <h2>Rekap</h2>
        <ul>
          {catatan.map((item) => (
            <li key={item.id}>{item.tanggal} - {item.kategori}: Rp {item.jumlah}</li>
          ))}
        </ul>
        <p>Total Pengeluaran: Rp {totalPengeluaran}</p>
      </div>
    </div>
  );
}

export default App;
