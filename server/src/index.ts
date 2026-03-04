import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const WES_API_KEY = process.env.WES_API_KEY;
const WES_API_BASE_URL = process.env.WES_API_BASE_URL || 'https://api.harrisjazzlines.com';

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!WES_API_KEY,
    apiBaseUrl: WES_API_BASE_URL,
  });
});

app.post('/api/lines', async (req, res) => {
  if (!WES_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(`${WES_API_BASE_URL}/lines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WES_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `API request failed: ${errorText}`,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/jazz-standards', (req, res) => {
  const standards = [
    {
      id: 'autumn-leaves',
      name: 'Autumn Leaves',
      composer: 'Joseph Kosma',
      key: 'G Minor',
      form: 'AABC (32 bars)',
      tempo: 'Medium Swing',
      difficulty: 'beginner',
      chords_original: ['Cm7', 'F7', 'BbMaj7', 'EbMaj7', 'Am7b5', 'D7', 'Gm7'],
      chords_improvisation: ['Cm7', 'F7', 'BbMaj7', 'EbMaj7', 'Am7b5', 'D7', 'Gm7'],
      description: 'Classic jazz standard with II-V-I progressions',
    },
    {
      id: 'all-the-things',
      name: 'All The Things You Are',
      composer: 'Jerome Kern',
      key: 'Ab Major',
      form: 'AABA (36 bars)',
      tempo: 'Medium',
      difficulty: 'advanced',
      chords_original: ['FmMaj7', 'Bbm7', 'Eb7', 'AbMaj7'],
      chords_improvisation: ['FmMaj7', 'Bbm7', 'Eb7', 'AbMaj7'],
      description: 'Sophisticated chord progression with multiple key centers',
    },
    {
      id: 'stella',
      name: 'Stella By Starlight',
      composer: 'Victor Young',
      key: 'Bb Major',
      form: 'ABAC (32 bars)',
      tempo: 'Medium Ballad',
      difficulty: 'advanced',
      chords_original: ['Em7b5', 'A7', 'Cm7', 'F7'],
      chords_improvisation: ['Em7b5', 'A7', 'Cm7', 'F7'],
      description: 'Complex harmony, ideal for advanced improvisation',
    },
    {
      id: 'blue-bossa',
      name: 'Blue Bossa',
      composer: 'Kenny Dorham',
      key: 'C Minor',
      form: 'AABA (16 bars)',
      tempo: 'Latin/Swing',
      difficulty: 'intermediate',
      chords_original: ['Cm7', 'Fm7', 'Dm7b5', 'G7'],
      chords_improvisation: ['Cm7', 'Fm7', 'Dm7b5', 'G7'],
      description: 'Latin jazz standard with modal sections',
    },
    {
      id: 'take-five',
      name: 'Take Five',
      composer: 'Paul Desmond',
      key: 'Eb Minor',
      form: 'AABA (44 bars)',
      tempo: 'Medium Swing',
      difficulty: 'intermediate',
      chords_original: ['Ebm7', 'Bbm7'],
      chords_improvisation: ['Ebm7', 'Bbm7'],
      description: 'Famous 5/4 time signature jazz waltz',
    },
    {
      id: 'summertime',
      name: 'Summertime',
      composer: 'George Gershwin',
      key: 'A Minor',
      form: 'AA (16 bars)',
      tempo: 'Slow',
      difficulty: 'beginner',
      chords_original: ['Am7', 'E7', 'Am7', 'E7'],
      chords_improvisation: ['Am7', 'E7', 'Am7', 'E7'],
      description: 'Bluesy ballad from Porgy and Bess',
    },
    {
      id: 'giant-steps',
      name: 'Giant Steps',
      composer: 'John Coltrane',
      key: 'B Major',
      form: 'AB (16 bars)',
      tempo: 'Fast',
      difficulty: 'advanced',
      chords_original: ['BMaj7', 'D7', 'GMaj7', 'Bb7', 'EbMaj7'],
      chords_improvisation: ['BMaj7', 'D7', 'GMaj7', 'Bb7', 'EbMaj7'],
      description: 'Coltrane changes, extremely challenging',
    },
    {
      id: 'my-funny',
      name: 'My Funny Valentine',
      composer: 'Richard Rodgers',
      key: 'C Minor',
      form: 'AABA (32 bars)',
      tempo: 'Ballad',
      difficulty: 'intermediate',
      chords_original: ['Cm7', 'Cm(Maj7)', 'Cm7', 'Cm6'],
      chords_improvisation: ['Cm7', 'Cm(Maj7)', 'Cm7', 'Cm6'],
      description: 'Romantic ballad with chromatic descending bass',
    },
    {
      id: 'solar',
      name: 'Solar',
      composer: 'Miles Davis',
      key: 'C Minor',
      form: 'AABA (12 bars)',
      tempo: 'Medium',
      difficulty: 'intermediate',
      chords_original: ['Cm7', 'Gm7', 'C7', 'FMaj7'],
      chords_improvisation: ['Cm7', 'Gm7', 'C7', 'FMaj7'],
      description: 'Minor blues with II-V progressions',
    },
    {
      id: 'satin-doll',
      name: 'Satin Doll',
      composer: 'Duke Ellington',
      key: 'C Major',
      form: 'AABA (32 bars)',
      tempo: 'Medium Swing',
      difficulty: 'beginner',
      chords_original: ['Dm7', 'G7', 'Em7', 'A7'],
      chords_improvisation: ['Dm7', 'G7', 'Em7', 'A7'],
      description: 'Elegant swing tune with smooth progressions',
    },
    {
      id: 'recorda-me',
      name: 'Recorda Me',
      composer: 'Joe Henderson',
      key: 'A Minor',
      form: 'AABA (16 bars)',
      tempo: 'Bossa Nova',
      difficulty: 'intermediate',
      chords_original: ['Am7', 'D7', 'GMaj7'],
      chords_improvisation: ['Am7', 'D7', 'GMaj7'],
      description: 'Bossa nova with modal flavor',
    },
    {
      id: 'days-of-wine',
      name: 'Days of Wine and Roses',
      composer: 'Henry Mancini',
      key: 'F Major',
      form: 'ABAC (32 bars)',
      tempo: 'Medium',
      difficulty: 'intermediate',
      chords_original: ['FMaj7', 'G7', 'Gm7', 'C7'],
      chords_improvisation: ['FMaj7', 'G7', 'Gm7', 'C7'],
      description: 'Classic movie theme with wide melodic range',
    },
    {
      id: 'cantaloupe',
      name: 'Cantaloupe Island',
      composer: 'Herbie Hancock',
      key: 'F Minor',
      form: 'AAAA (16 bars)',
      tempo: 'Funk/Groove',
      difficulty: 'beginner',
      chords_original: ['Fm7', 'Db7', 'Dm7'],
      chords_improvisation: ['Fm7', 'Db7', 'Dm7'],
      description: 'Funky modal tune with repeating vamp',
    },
    {
      id: 'girl-from',
      name: 'The Girl from Ipanema',
      composer: 'Antonio Carlos Jobim',
      key: 'F Major',
      form: 'AABA (40 bars)',
      tempo: 'Bossa Nova',
      difficulty: 'beginner',
      chords_original: ['FMaj7', 'G7', 'Gm7', 'Gb7'],
      chords_improvisation: ['FMaj7', 'G7', 'Gm7', 'Gb7'],
      description: 'Bossa nova classic with chromatic bridge',
    },
    {
      id: 'tune-up',
      name: 'Tune Up',
      composer: 'Miles Davis',
      key: 'D Major',
      form: 'ABC (16 bars)',
      tempo: 'Medium Fast',
      difficulty: 'intermediate',
      chords_original: ['Em7', 'A7', 'DMaj7', 'Dm7', 'G7', 'CMaj7', 'Cm7', 'F7', 'BbMaj7'],
      chords_improvisation: ['Em7', 'A7', 'DMaj7', 'Dm7', 'G7', 'CMaj7', 'Cm7', 'F7', 'BbMaj7'],
      description: 'Three consecutive II-V-I progressions',
    },
  ];

  res.json(standards);
});

app.get('/api/jazz-standards/:id', (req, res) => {
  const standards = {
    'autumn-leaves': {
      id: 'autumn-leaves',
      name: 'Autumn Leaves',
      composer: 'Joseph Kosma',
      key: 'G Minor',
      form: 'AABC (32 bars)',
      tempo: 'Medium Swing',
      difficulty: 'beginner',
      chords_original: ['Cm7', 'F7', 'BbMaj7', 'EbMaj7', 'Am7b5', 'D7', 'Gm7', 'Gm7'],
      chords_improvisation: ['Cm7', 'F7', 'BbMaj7', 'EbMaj7', 'Am7b5', 'D7', 'Gm7', 'Gm7'],
      description: 'Classic jazz standard with II-V-I progressions in multiple keys',
    },
    'blue-bossa': {
      id: 'blue-bossa',
      name: 'Blue Bossa',
      composer: 'Kenny Dorham',
      key: 'C Minor',
      form: 'AB | AB (16 bars)',
      tempo: 'Medium Bossa',
      difficulty: 'intermediate',
      chords_original: [
        'Cm7',
        'Fm7',
        'Dm7b5',
        'G7',
        'Cm7',
        'Ebm7',
        'Ab7',
        'DbMaj7',
        'Dm7b5',
        'G7',
        'Cm7',
        'Dm7b5',
        'G7',
        'Cm7',
        'Dm7b5',
        'G7',
      ],
      chords_improvisation: [
        'Cm7',
        'Fm7',
        'Dm7b5',
        'G7',
        'Cm7',
        'Ebm7',
        'Ab7',
        'DbMaj7',
        'Dm7b5',
        'G7',
        'Cm7',
        'Dm7b5',
        'G7',
        'Cm7',
        'Dm7b5',
        'G7',
      ],
      description:
        'Popular bossa nova with straightforward harmony, ideal for Barry Harris lines. No simplification needed - progression is already clear.',
    },
  };

  const standard = standards[req.params.id];
  if (standard) {
    res.json(standard);
  } else {
    res.status(404).json({ error: 'Standard not found' });
  }
});

app.post('/api/barry-harris/generate-instructions', (req, res) => {
  res.json({
    transitions: [
      {
        from_chord: 'Cm7',
        to_chord: 'F7',
        from_scale: { root: 'C', pattern: 'Minor' },
        to_scale: { root: 'F', pattern: 'Dominant' },
        possible_paths: [
          {
            path_id: 'path-1',
            instruction: {
              id: 'instr-1',
              from_scale: { root: 'C', pattern: 'Minor' },
              to_scale: { root: 'F', pattern: 'Dominant' },
              patterns: ['HalfStepUp', 'ChordDown'],
              guitar_settings: { caged_shape: 'E', tuning: 'StandardTuning' },
            },
            metadata: { path_length: 4, target_degree: 'V', pattern: 'HalfStepUp' },
          },
        ],
      },
    ],
    metadata: { original_chords: ['Cm7', 'F7'], total_transitions: 1, total_paths: 1 },
  });
});

app.post('/api/barry-harris/materialize-instructions', (req, res) => {
  res.json({
    lines: [
      {
        id: 'line-1',
        pitches: ['C4', 'Db4', 'E4', 'G4'],
        guitar_line: { tab: ['8', '9', '9', '10'], position: 'E' },
      },
    ],
  });
});

app.all('/api/*', async (req, res) => {
  if (!WES_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const apiPath = req.path.replace('/api', '');
  const queryString = req.url.split('?')[1] || '';

  try {
    const response = await fetch(`${WES_API_BASE_URL}${apiPath}${queryString ? `?${queryString}` : ''}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WES_API_KEY}`,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `API request failed: ${errorText}`,
      });
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      const text = await response.text();
      res.json({ message: text });
    }
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`API Key configured: ${!!WES_API_KEY}`);
  console.log(`API Base URL: ${WES_API_BASE_URL}`);
});
