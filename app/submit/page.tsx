'use client';
import { useRouter } from 'next/navigation';

export default function SubmitGamePage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;
    const gameFile = formData.get('gameFile') as File;

    // Create new game object
    const newGame = {
      id: Date.now().toString(),
      title: title,
      description: description,
      link: link || '',
      fileName: gameFile ? gameFile.name : '',
      developer: "Indie Creator",
      genre: "Action / RPG"
    };

    // Fetch existing games from localStorage and add the new one
    const existingGames = JSON.parse(localStorage.getItem('indipulse_games') || '{}');
    existingGames[newGame.id] = newGame;
    
    // Save updated list back to localStorage
    localStorage.setItem('indipulse_games', JSON.stringify(existingGames));

    alert('Game Submitted Successfully and added to Search!');
    
    // Reset form
    e.currentTarget.reset();
  };

  return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)', 
      color: '#fff', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        background: 'rgba(30, 41, 59, 0.85)', 
        backdropFilter: 'blur(12px)',
        padding: '30px', 
        borderRadius: '16px',
        border: '1px solid rgba(236, 72, 153, 0.4)',
        boxShadow: '0 15px 30px -5px rgba(236, 72, 153, 0.3)'
      }}>
        <h2 style={{ color: '#f43f5e', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold', textAlign: 'center' }}>
          🎮 IndiePulse - Submit Game
        </h2>
        
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1', fontWeight: '500' }}>Game Name</label>
          <input 
            type="text" 
            name="title"
            required
            placeholder="Enter game name..."
            style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#090d16', border: '1px solid #ec4899', color: '#fff', borderRadius: '8px', outline: 'none' }}
          />

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1', fontWeight: '500' }}>Description</label>
          <textarea 
            name="description"
            required
            rows={3}
            placeholder="Enter game description..."
            style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#090d16', border: '1px solid #ec4899', color: '#fff', borderRadius: '8px', outline: 'none', resize: 'none' }}
          />

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1', fontWeight: '500' }}>Link</label>
          <input 
            type="url" 
            name="link"
            placeholder="Enter game URL (e.g., https://...)"
            style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#090d16', border: '1px solid #ec4899', color: '#fff', borderRadius: '8px', outline: 'none' }}
          />

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1', fontWeight: '500' }}>Upload Game File (From Gallery)</label>
          <input 
            type="file" 
            name="gameFile"
            style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#090d16', border: '1px solid #ec4899', color: '#fff', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
          />

          <button 
            type="submit"
            style={{ width: '100%', padding: '12px', background: 'linear-gradient(to right, #db2777, #9333ea)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 15px rgba(219, 39, 119, 0.4)' }}
          >
            Submit Game ⚡
          </button>
        </form>

        {/* Pink Back Button */}
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <button 
            onClick={() => router.back()}
            style={{ 
              width: '100%',
              padding: '10px', 
              background: '#db2777', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(219, 39, 119, 0.3)'
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}