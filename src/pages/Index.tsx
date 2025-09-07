import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  username: string;
  displayName: string;
  password: string;
  coins: number;
  friends: number[];
  isAdmin: boolean;
  isBanned: boolean;
  language: 'ru' | 'en' | 'ko';
  skin: {
    head: string;
    body: string;
    legs: string;
  };
}

interface Place {
  id: number;
  name: string;
  description: string;
  creator: string;
  players: User[];
  maxPlayers: number;
  image: string;
  customControls: { [key: string]: string };
  blocks: Block[];
}

interface Block {
  id: string;
  type: 'cube' | 'platform' | 'spawn' | 'teleporter';
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  color: string;
  properties?: any;
}

interface GameState {
  mode: 'menu' | 'playing' | 'building' | 'skinEditor';
  currentPlace?: Place;
  playerPosition: { x: number; y: number; z: number };
  playerRotation: { x: number; y: number };
  keys: { [key: string]: boolean };
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    mode: 'menu',
    playerPosition: { x: 0, y: 10, z: 0 },
    playerRotation: { x: 0, y: 0 },
    keys: {}
  });
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: 'sistemblok',
      displayName: 'SystemBlok',
      password: '38674128',
      coins: 999999,
      friends: [],
      isAdmin: true,
      isBanned: false,
      language: 'ru',
      skin: {
        head: '#FF6B6B',
        body: '#4ECDC4',
        legs: '#45B7D1'
      }
    },
    {
      id: 2,
      username: 'player1',
      displayName: 'Player One',
      password: 'demo123',
      coins: 150,
      friends: [],
      isAdmin: false,
      isBanned: false,
      language: 'ru',
      skin: {
        head: '#96CEB4',
        body: '#FECA57',
        legs: '#FF9FF3'
      }
    },
    {
      id: 3,
      username: 'gamer2024',
      displayName: 'Pro Gamer',
      password: 'game456',
      coins: 500,
      friends: [],
      isAdmin: false,
      isBanned: false,
      language: 'en',
      skin: {
        head: '#A8E6CF',
        body: '#FFB3BA',
        legs: '#FFDFBA'
      }
    }
  ]);
  
  const [places] = useState<Place[]>([
    {
      id: 1,
      name: 'Паркур',
      description: 'Прыжки и акробатика в 3D мире',
      creator: 'sistemblok',
      players: [users[0], users[1], users[2]].slice(0, Math.floor(Math.random() * 3) + 1),
      maxPlayers: 50,
      image: '/placeholder.svg',
      customControls: {
        'KeyW': 'Вперед',
        'KeyS': 'Назад',
        'KeyA': 'Влево',
        'KeyD': 'Вправо',
        'Space': 'Прыжок',
        'KeyE': 'Взаимодействие',
        'KeyF': 'Ускорение'
      },
      blocks: [
        { id: '1', type: 'spawn', position: { x: 0, y: 0, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: '#4ECDC4' },
        { id: '2', type: 'platform', position: { x: 5, y: 2, z: 0 }, size: { width: 3, height: 1, depth: 3 }, color: '#FF6B6B' },
        { id: '3', type: 'platform', position: { x: 10, y: 5, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: '#45B7D1' }
      ]
    },
    {
      id: 2,
      name: 'Лабиринт',
      description: 'Найди выход из сложного лабиринта',
      creator: 'sistemblok',
      players: [users[0], users[2]].slice(0, Math.floor(Math.random() * 2) + 1),
      maxPlayers: 30,
      image: '/placeholder.svg',
      customControls: {
        'KeyW': 'Вперед',
        'KeyS': 'Назад',
        'KeyA': 'Влево',
        'KeyD': 'Вправо',
        'Space': 'Прыжок',
        'KeyE': 'Взаимодействие',
        'KeyR': 'Телепорт'
      },
      blocks: [
        { id: '1', type: 'spawn', position: { x: 0, y: 0, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: '#96CEB4' },
        { id: '2', type: 'cube', position: { x: -3, y: 0, z: 0 }, size: { width: 1, height: 3, depth: 1 }, color: '#8B4513' },
        { id: '3', type: 'cube', position: { x: 3, y: 0, z: 0 }, size: { width: 1, height: 3, depth: 1 }, color: '#8B4513' },
        { id: '4', type: 'teleporter', position: { x: 10, y: 0, z: 10 }, size: { width: 2, height: 3, depth: 2 }, color: '#9B59B6' }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [gameTab, setGameTab] = useState('play');
  const [language, setLanguage] = useState<'ru' | 'en' | 'ko'>('ru');

  const translations = {
    ru: {
      title: 'PYBLOX',
      subtitle: 'Игровая платформа нового поколения',
      login: 'Вход',
      register: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердить пароль',
      loginBtn: 'Войти',
      registerBtn: 'Зарегистрироваться',
      play: 'Играть',
      create: 'Создать',
      website: 'Сайт',
      settings: 'Настройки',
      friends: 'Друзья',
      leaderboard: 'Лидерборд',
      coins: 'Земейки',
      players: 'игроков',
      places: 'Плейсы',
      chat: 'Чат',
      reset: 'Сброс',
      leave: 'Выйти',
      graphics: 'Графика',
      lowEnd: 'Слабые устройства',
      highEnd: 'Мощные устройства',
      language: 'Язык'
    },
    en: {
      title: 'PYBLOX',
      subtitle: 'Next Generation Gaming Platform',
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loginBtn: 'Login',
      registerBtn: 'Register',
      play: 'Play',
      create: 'Create',
      website: 'Website',
      settings: 'Settings',
      friends: 'Friends',
      leaderboard: 'Leaderboard',
      coins: 'Coins',
      players: 'players',
      places: 'Places',
      chat: 'Chat',
      reset: 'Reset',
      leave: 'Leave',
      graphics: 'Graphics',
      lowEnd: 'Low-end devices',
      highEnd: 'High-end devices',
      language: 'Language'
    },
    ko: {
      title: 'PYBLOX',
      subtitle: '차세대 게임 플랫폼',
      login: '로그인',
      register: '가입하기',
      username: '사용자명',
      password: '비밀번호',
      confirmPassword: '비밀번호 확인',
      loginBtn: '로그인',
      registerBtn: '가입하기',
      play: '플레이',
      create: '만들기',
      website: '웹사이트',
      settings: '설정',
      friends: '친구',
      leaderboard: '리더보드',
      coins: '코인',
      players: '플레이어',
      places: '플레이스',
      chat: '채팅',
      reset: '리셋',
      leave: '나가기',
      graphics: '그래픽',
      lowEnd: '저사양 기기',
      highEnd: '고사양 기기',
      language: '언어'
    }
  };

  const t = translations[language];

  const handleLogin = () => {
    const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user && !user.isBanned) {
      setCurrentUser(user);
    }
  };

  const handleRegister = () => {
    if (registerForm.password !== registerForm.confirmPassword) return;
    if (users.some(u => u.username === registerForm.username)) return;
    
    const newUser: User = {
      id: users.length + 1,
      username: registerForm.username,
      displayName: registerForm.username,
      password: registerForm.password,
      coins: 100,
      friends: [],
      isAdmin: false,
      isBanned: false,
      language: 'ru',
      skin: {
        head: '#FF6B6B',
        body: '#4ECDC4',
        legs: '#45B7D1'
      }
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  // Game controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState.mode !== 'playing') return;
    setGameState(prev => ({ ...prev, keys: { ...prev.keys, [e.code]: true } }));
  }, [gameState.mode]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (gameState.mode !== 'playing') return;
    setGameState(prev => ({ ...prev, keys: { ...prev.keys, [e.code]: false } }));
  }, [gameState.mode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Game loop for movement
  useEffect(() => {
    if (gameState.mode !== 'playing') return;
    
    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const speed = 0.2;
        const jumpHeight = 0.5;
        let { x, y, z } = prev.playerPosition;
        
        if (prev.keys['KeyW']) z -= speed;
        if (prev.keys['KeyS']) z += speed;
        if (prev.keys['KeyA']) x -= speed;
        if (prev.keys['KeyD']) x += speed;
        if (prev.keys['Space'] && y <= 10) y += jumpHeight;
        
        // Gravity
        if (y > 10) y -= 0.1;
        if (y < 10) y = 10;
        
        return { ...prev, playerPosition: { x, y, z } };
      });
    }, 16);
    
    return () => clearInterval(gameLoop);
  }, [gameState.mode]);

  const enterPlace = (place: Place) => {
    setGameState({
      ...gameState,
      mode: 'playing',
      currentPlace: place,
      playerPosition: { x: 0, y: 10, z: 0 }
    });
  };

  const exitGame = () => {
    setGameState({ ...gameState, mode: 'menu', currentPlace: undefined });
    setGameTab('play');
  };

  const enterBuilder = () => {
    setGameState({ ...gameState, mode: 'building' });
  };

  const enterSkinEditor = () => {
    setGameState({ ...gameState, mode: 'skinEditor' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('login');
  };

  const leaderboardUsers = users
    .filter(u => !u.isBanned)
    .sort((a, b) => b.coins - a.coins)
    .slice(0, 10);

  // Render game modes
  if (gameState.mode === 'playing' && gameState.currentPlace) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* 3D Game View */}
        <div className="h-screen flex items-center justify-center">
          <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-blue-400">
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-500"></div>
            
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-600 to-green-400"></div>
            
            {/* Render blocks */}
            <div className="absolute inset-0" style={{ perspective: '1000px' }}>
              {gameState.currentPlace.blocks.map(block => {
                const distance = Math.sqrt(
                  Math.pow(block.position.x - gameState.playerPosition.x, 2) +
                  Math.pow(block.position.z - gameState.playerPosition.z, 2)
                );
                const scale = Math.max(0.3, 1 - distance / 20);
                
                return (
                  <div
                    key={block.id}
                    className="absolute transition-all duration-100"
                    style={{
                      left: `${50 + (block.position.x - gameState.playerPosition.x) * 10}%`,
                      top: `${50 - (block.position.y - gameState.playerPosition.y) * 5 - (block.position.z - gameState.playerPosition.z) * 2}%`,
                      width: `${block.size.width * scale * 50}px`,
                      height: `${block.size.height * scale * 50}px`,
                      backgroundColor: block.color,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderRadius: block.type === 'teleporter' ? '50%' : '4px',
                      transform: `scale(${scale})`,
                      zIndex: Math.floor(100 - distance)
                    }}
                  >
                    {block.type === 'spawn' && (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                        SPAWN
                      </div>
                    )}
                    {block.type === 'teleporter' && (
                      <div className="w-full h-full flex items-center justify-center text-white animate-pulse">
                        ✨
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Player */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-12 relative">
                {/* Head */}
                <div 
                  className="w-6 h-6 rounded mx-auto mb-1" 
                  style={{ backgroundColor: currentUser.skin.head }}
                ></div>
                {/* Body */}
                <div 
                  className="w-8 h-4 rounded-sm" 
                  style={{ backgroundColor: currentUser.skin.body }}
                ></div>
                {/* Legs */}
                <div className="flex justify-center mt-1">
                  <div 
                    className="w-2 h-3 rounded-sm mr-1" 
                    style={{ backgroundColor: currentUser.skin.legs }}
                  ></div>
                  <div 
                    className="w-2 h-3 rounded-sm" 
                    style={{ backgroundColor: currentUser.skin.legs }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game UI */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="bg-black/70 p-3 rounded-lg">
            <h3 className="text-white font-bold">{gameState.currentPlace.name}</h3>
            <p className="text-gray-300 text-sm">Игроков: {gameState.currentPlace.players.length}/{gameState.currentPlace.maxPlayers}</p>
          </div>
          
          <div className="bg-black/70 p-2 rounded-lg text-xs space-y-1">
            <div className="text-white font-bold">Управление:</div>
            {Object.entries(gameState.currentPlace.customControls).map(([key, action]) => (
              <div key={key} className="text-gray-300">
                <kbd className="bg-gray-700 px-1 rounded text-xs">
                  {key.replace('Key', '').replace('Space', 'Пробел')}
                </kbd> - {action}
              </div>
            ))}
          </div>
        </div>
        
        {/* Online Players */}
        <div className="absolute top-4 right-4">
          <div className="bg-black/70 p-3 rounded-lg w-48">
            <h4 className="text-white font-bold text-sm mb-2">Онлайн игроки</h4>
            <div className="space-y-1">
              {gameState.currentPlace.players.map(player => (
                <div key={player.id} className="flex items-center space-x-2 text-xs">
                  <div className="flex">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: player.skin.head }}></div>
                    <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: player.skin.body }}></div>
                  </div>
                  <span className="text-white">{player.displayName}</span>
                  {player.isAdmin && <Badge className="bg-red-600 text-xs">A</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Exit button */}
        <div className="absolute bottom-4 left-4">
          <Button onClick={exitGame} className="gaming-gradient">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Выйти из игры
          </Button>
        </div>
        
        {/* Position info */}
        <div className="absolute bottom-4 right-4 bg-black/70 p-2 rounded-lg text-xs text-white">
          Позиция: X:{gameState.playerPosition.x.toFixed(1)} Y:{gameState.playerPosition.y.toFixed(1)} Z:{gameState.playerPosition.z.toFixed(1)}
        </div>
      </div>
    );
  }
  
  // Building mode
  if (gameState.mode === 'building') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="gaming-gradient p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Редактор плейсов</h1>
            <Button onClick={() => setGameState({ ...gameState, mode: 'menu' })} variant="outline">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад в меню
            </Button>
          </div>
        </header>
        
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Block palette */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Блоки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'cube', color: '#8B4513', name: 'Куб' },
                    { type: 'platform', color: '#FF6B6B', name: 'Платформа' },
                    { type: 'spawn', color: '#4ECDC4', name: 'Спавн' },
                    { type: 'teleporter', color: '#9B59B6', name: 'Телепорт' }
                  ].map(block => (
                    <div key={block.type} className="p-3 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-700">
                      <div className="w-12 h-12 mx-auto mb-2 rounded" style={{ backgroundColor: block.color }}></div>
                      <p className="text-center text-xs text-white">{block.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Properties */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Свойства</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm">Размер X</label>
                    <Input type="number" defaultValue="1" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                  <div>
                    <label className="text-white text-sm">Размер Y</label>
                    <Input type="number" defaultValue="1" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                  <div>
                    <label className="text-white text-sm">Размер Z</label>
                    <Input type="number" defaultValue="1" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                  <div>
                    <label className="text-white text-sm">Цвет</label>
                    <Input type="color" defaultValue="#FF6B6B" className="bg-gray-800 border-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Code Editor */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Код плейса</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea 
                  className="w-full h-64 bg-gray-800 border-gray-600 text-white p-3 rounded font-mono text-sm"
                  placeholder="-- Код Lua для плейса\nfunction onPlayerJoin(player)\n  print('Игрок ' .. player.name .. ' присоединился!')\nend\n\nfunction onKeyPress(player, key)\n  if key == 'f' then\n    -- Взрыв\n    explode(player.position)\n  end\nend"
                />
                <div className="mt-4 space-y-2">
                  <div>
                    <label className="text-white text-sm">Кастомные клавиши</label>
                    <div className="flex space-x-2 mt-1">
                      <Input placeholder="Клавиша (f)" className="bg-gray-800 border-gray-600 text-white" />
                      <Input placeholder="Действие" className="bg-gray-800 border-gray-600 text-white" />
                      <Button size="sm" className="gaming-gradient">+</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 3D Preview */}
          <Card className="gaming-card mt-6">
            <CardHeader>
              <CardTitle className="text-white">3D Превью</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-b from-blue-400 to-green-400 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Icon name="Cube" size={48} className="mx-auto mb-2" />
                    <p>Интерактивный 3D редактор</p>
                    <p className="text-sm opacity-70">Перетащите блоки для размещения</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Skin Editor
  if (gameState.mode === 'skinEditor') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="gaming-gradient p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Редактор скинов</h1>
            <Button onClick={() => setGameState({ ...gameState, mode: 'menu' })} variant="outline">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад в меню
            </Button>
          </div>
        </header>
        
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skin Preview */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Превью скина</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-96">
                <div className="transform scale-150">
                  {/* Character Model */}
                  <div className="w-16 h-24 relative">
                    {/* Head */}
                    <div 
                      className="w-12 h-12 rounded mx-auto mb-2 border-2 border-white/30" 
                      style={{ backgroundColor: currentUser?.skin.head }}
                    ></div>
                    {/* Body */}
                    <div 
                      className="w-16 h-8 rounded-sm border-2 border-white/30" 
                      style={{ backgroundColor: currentUser?.skin.body }}
                    ></div>
                    {/* Legs */}
                    <div className="flex justify-center mt-2">
                      <div 
                        className="w-4 h-6 rounded-sm mr-2 border-2 border-white/30" 
                        style={{ backgroundColor: currentUser?.skin.legs }}
                      ></div>
                      <div 
                        className="w-4 h-6 rounded-sm border-2 border-white/30" 
                        style={{ backgroundColor: currentUser?.skin.legs }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Color Customization */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Настройка цветов</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Голова</label>
                  <div className="flex items-center space-x-3">
                    <Input 
                      type="color" 
                      value={currentUser?.skin.head}
                      onChange={(e) => currentUser && setCurrentUser({...currentUser, skin: {...currentUser.skin, head: e.target.value}})}
                      className="w-16 h-10"
                    />
                    <Input 
                      type="text" 
                      value={currentUser?.skin.head}
                      className="bg-gray-800 border-gray-600 text-white"
                      readOnly
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Тело</label>
                  <div className="flex items-center space-x-3">
                    <Input 
                      type="color" 
                      value={currentUser?.skin.body}
                      onChange={(e) => currentUser && setCurrentUser({...currentUser, skin: {...currentUser.skin, body: e.target.value}})}
                      className="w-16 h-10"
                    />
                    <Input 
                      type="text" 
                      value={currentUser?.skin.body}
                      className="bg-gray-800 border-gray-600 text-white"
                      readOnly
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Ноги</label>
                  <div className="flex items-center space-x-3">
                    <Input 
                      type="color" 
                      value={currentUser?.skin.legs}
                      onChange={(e) => currentUser && setCurrentUser({...currentUser, skin: {...currentUser.skin, legs: e.target.value}})}
                      className="w-16 h-10"
                    />
                    <Input 
                      type="text" 
                      value={currentUser?.skin.legs}
                      className="bg-gray-800 border-gray-600 text-white"
                      readOnly
                    />
                  </div>
                </div>
                
                {/* Preset colors */}
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Готовые наборы</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { head: '#FF6B6B', body: '#4ECDC4', legs: '#45B7D1' },
                      { head: '#96CEB4', body: '#FECA57', legs: '#FF9FF3' },
                      { head: '#A8E6CF', body: '#FFB3BA', legs: '#FFDFBA' },
                      { head: '#DDA0DD', body: '#98FB98', legs: '#F0E68C' }
                    ].map((preset, index) => (
                      <div 
                        key={index}
                        className="cursor-pointer p-2 rounded border border-gray-600 hover:border-pyblox-blue"
                        onClick={() => currentUser && setCurrentUser({...currentUser, skin: preset})}
                      >
                        <div className="w-8 h-12 mx-auto">
                          <div className="w-6 h-6 rounded mx-auto mb-1" style={{ backgroundColor: preset.head }}></div>
                          <div className="w-8 h-4 rounded-sm" style={{ backgroundColor: preset.body }}></div>
                          <div className="flex justify-center mt-1">
                            <div className="w-2 h-3 rounded-sm mr-1" style={{ backgroundColor: preset.legs }}></div>
                            <div className="w-2 h-3 rounded-sm" style={{ backgroundColor: preset.legs }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full gaming-gradient hover-glow">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить скин
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center gaming-gradient p-4">
        <Card className="w-full max-w-md gaming-card border-pyblox-blue/30">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-pyblox-blue gaming-gradient bg-clip-text text-transparent">
              {t.title}
            </CardTitle>
            <p className="text-gray-300 text-sm">{t.subtitle}</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Select value={language} onValueChange={(value: 'ru' | 'en' | 'ko') => setLanguage(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">🇷🇺</SelectItem>
                  <SelectItem value="en">🇺🇸</SelectItem>
                  <SelectItem value="ko">🇰🇷</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t.login}</TabsTrigger>
                <TabsTrigger value="register">{t.register}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <Input
                  placeholder={t.username}
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Input
                  type="password"
                  placeholder={t.password}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Button 
                  className="w-full gaming-gradient hover-glow"
                  onClick={handleLogin}
                >
                  {t.loginBtn}
                </Button>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <Input
                  placeholder={t.username}
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Input
                  type="password"
                  placeholder={t.password}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Input
                  type="password"
                  placeholder={t.confirmPassword}
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Button 
                  className="w-full gaming-gradient hover-glow"
                  onClick={handleRegister}
                >
                  {t.registerBtn}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="gaming-gradient p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">{t.title}</h1>
            {currentUser.isAdmin && (
              <Badge className="bg-red-600 text-white">ADMIN</Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Coins" size={20} className="text-pyblox-gold" />
              <span className="text-pyblox-gold font-bold">{currentUser.coins}</span>
            </div>
            
            <Avatar>
              <AvatarFallback className="bg-pyblox-blue text-white">
                {currentUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <span className="text-white font-medium">{currentUser.displayName}</span>
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <Tabs value={gameTab} onValueChange={setGameTab}>
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="play">
              <Icon name="Play" size={16} className="mr-2" />
              {t.play}
            </TabsTrigger>
            <TabsTrigger value="create">
              <Icon name="Plus" size={16} className="mr-2" />
              {t.create}
            </TabsTrigger>
            <TabsTrigger value="website">
              <Icon name="Globe" size={16} className="mr-2" />
              {t.website}
            </TabsTrigger>
            <TabsTrigger value="friends">
              <Icon name="Users" size={16} className="mr-2" />
              {t.friends}
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Icon name="Trophy" size={16} className="mr-2" />
              {t.leaderboard}
            </TabsTrigger>
            <TabsTrigger value="skins">
              <Icon name="Palette" size={16} className="mr-2" />
              Скины
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Icon name="Settings" size={16} className="mr-2" />
              {t.settings}
            </TabsTrigger>
          </TabsList>

          {/* Play Tab */}
          <TabsContent value="play">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <Card key={place.id} className="gaming-card hover-glow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="aspect-video bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                      <Icon name="Image" size={48} className="text-gray-500" />
                    </div>
                    <CardTitle className="text-white text-lg">{place.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{place.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400 text-sm">by {place.creator}</span>
                      <Badge className="bg-green-600">
                        {place.players.length}/{place.maxPlayers} {t.players}
                      </Badge>
                    </div>
                    
                    {/* Online players preview */}
                    <div className="mb-3">
                      <div className="flex -space-x-1">
                        {place.players.slice(0, 3).map(player => (
                          <div key={player.id} className="w-6 h-6 rounded-full border-2 border-white flex-shrink-0">
                            <div className="w-full h-full rounded-full" style={{ backgroundColor: player.skin.head }}></div>
                          </div>
                        ))}
                        {place.players.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-white flex items-center justify-center text-xs text-white">
                            +{place.players.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full gaming-gradient hover-glow"
                      onClick={() => enterPlace(place)}
                    >
                      <Icon name="Play" size={16} className="mr-2" />
                      {t.play}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Tab */}
          <TabsContent value="create">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Создать новый плейс</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Название плейса" className="bg-gray-800 border-gray-600 text-white" />
                  <Input placeholder="Описание" className="bg-gray-800 border-gray-600 text-white" />
                  <Button 
                    className="gaming-gradient hover-glow"
                    onClick={enterBuilder}
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать плейс
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Website Tab */}
          <TabsContent value="website">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Создать сайт</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Создавайте собственные веб-сайты для ваших игр</p>
                <Button className="gaming-gradient hover-glow">
                  <Icon name="Code" size={16} className="mr-2" />
                  Начать создание
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">{t.friends}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Найти друзей..." className="bg-gray-800 border-gray-600 text-white" />
                  <div className="text-center py-8 text-gray-400">
                    <Icon name="UserPlus" size={48} className="mx-auto mb-2" />
                    <p>Добавьте друзей для совместной игры</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Icon name="Trophy" size={24} className="mr-2 text-pyblox-gold" />
                  {t.leaderboard}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {leaderboardUsers.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                        <div className="flex items-center space-x-3">
                          <Badge className={
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-600' : 'bg-gray-600'
                          }>
                            #{index + 1}
                          </Badge>
                          <Avatar>
                            <AvatarFallback className="bg-pyblox-blue">
                              {user.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{user.displayName}</p>
                            {user.isAdmin && (
                              <Badge className="bg-red-600 text-xs">ADMIN</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Coins" size={16} className="text-pyblox-gold" />
                          <span className="text-pyblox-gold font-bold">{user.coins}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          {/* Skins Tab */}
          <TabsContent value="skins">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Icon name="Palette" size={24} className="mr-2 text-pyblox-gold" />
                  Редактор скинов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Current skin preview */}
                    <div className="w-16 h-24">
                      <div className="w-12 h-12 rounded mx-auto mb-2" style={{ backgroundColor: currentUser.skin.head }}></div>
                      <div className="w-16 h-8 rounded-sm" style={{ backgroundColor: currentUser.skin.body }}></div>
                      <div className="flex justify-center mt-2">
                        <div className="w-4 h-6 rounded-sm mr-2" style={{ backgroundColor: currentUser.skin.legs }}></div>
                        <div className="w-4 h-6 rounded-sm" style={{ backgroundColor: currentUser.skin.legs }}></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Текущий скин</h4>
                      <p className="text-gray-400 text-sm">Настройте внешний вид персонажа</p>
                    </div>
                  </div>
                  <Button 
                    className="gaming-gradient hover-glow"
                    onClick={enterSkinEditor}
                  >
                    <Icon name="Edit" size={16} className="mr-2" />
                    Редактировать скин
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle className="text-white">Игровые настройки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Icon name="RotateCcw" size={16} className="mr-2" />
                    {t.reset}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Icon name="LogOut" size={16} className="mr-2" />
                    {t.leave}
                  </Button>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">{t.graphics}</label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Выберите качество" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t.lowEnd}</SelectItem>
                        <SelectItem value="high">{t.highEnd}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle className="text-white">Профиль</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">{t.language}</label>
                    <Select value={language} onValueChange={(value: 'ru' | 'en' | 'ko') => setLanguage(value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="ko">🇰🇷 한국어</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input 
                    placeholder="Новый пароль" 
                    type="password"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Button className="w-full gaming-gradient hover-glow">
                    Сохранить изменения
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Global Chat */}
      <div className="fixed bottom-4 right-4 w-80">
        <Card className="gaming-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center">
              <Icon name="MessageCircle" size={16} className="mr-2" />
              {t.chat}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32 mb-3">
              <div className="space-y-2 text-xs">
                <div className="text-gray-400">
                  <span className="text-pyblox-blue">SystemBlok:</span> Добро пожаловать в Pyblox!
                </div>
              </div>
            </ScrollArea>
            <Input 
              placeholder="Написать сообщение..." 
              className="bg-gray-800 border-gray-600 text-white text-xs"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;