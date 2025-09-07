import React, { useState } from 'react';
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
}

interface Place {
  id: number;
  name: string;
  description: string;
  creator: string;
  players: number;
  maxPlayers: number;
  image: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
      language: 'ru'
    }
  ]);
  
  const [places] = useState<Place[]>([
    {
      id: 1,
      name: 'Паркур',
      description: 'Прыжки и акробатика в 3D мире',
      creator: 'sistemblok',
      players: 24,
      maxPlayers: 50,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Лабиринт',
      description: 'Найди выход из сложного лабиринта',
      creator: 'sistemblok',
      players: 18,
      maxPlayers: 30,
      image: '/placeholder.svg'
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
      language: 'ru'
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('login');
  };

  const leaderboardUsers = users
    .filter(u => !u.isBanned)
    .sort((a, b) => b.coins - a.coins)
    .slice(0, 10);

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
          <TabsList className="grid w-full grid-cols-6 mb-6">
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
                        {place.players}/{place.maxPlayers} {t.players}
                      </Badge>
                    </div>
                    <Button className="w-full gaming-gradient hover-glow">
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
                  <Button className="gaming-gradient hover-glow">
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