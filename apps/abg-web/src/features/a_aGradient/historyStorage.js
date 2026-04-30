const STORAGE_KEY = 'aaGradientHistory';

export const getHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, '0');
  
  return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
};

export const addPatientRecord = (patientId, name, currentResult) => {
  if (!patientId || !name) return false;

  const history = getHistory();
  const existingPatient = history.find(p => p.patientId === patientId);

  if (existingPatient) {
    // If patient exists, we shouldn't add a new patient with the same ID. 
    // Return false so UI can handle it (maybe prompt to update instead).
    return false;
  }

  const newPatient = {
    id: `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    patientId: patientId,
    name: name,
    createdAt: new Date().toISOString(),
    results: [
      {
        ...currentResult,
        date: formatDate(new Date())
      }
    ]
  };

  history.push(newPatient);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return true;
};

export const updatePatientRecord = (patientId, currentResult) => {
  if (!patientId) return false;

  const history = getHistory();
  const patientIndex = history.findIndex(p => p.patientId === patientId);

  if (patientIndex === -1) {
    // Patient not found
    return false;
  }

  history[patientIndex].results.push({
    ...currentResult,
    date: formatDate(new Date())
  });

  // Sort history array so updated patient might optionally come first or just update inline
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return true;
};

export const deleteAllHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
