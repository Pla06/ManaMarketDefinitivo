import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { Footer } from './components/footer/Footer';
import { Home } from './components/home/Home';
import { CardList } from './components/card/CardList/CardList';
import { CardDetail } from './components/card/CardDetail/CardDetail';
import { CardEdit } from './components/card/CardEdit/CardEdit';
import { CartPage } from './components/cart/CartPage/CartPage';
import { Favorites } from './components/favorites/Favorites';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/card/list" element={<CardList />} />
            <Route path="/card/detail/:id" element={<CardDetail />} />
            <Route path="/card/add" element={<CardEdit />} />
            <Route path="/card/edit/:id" element={<CardEdit />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
