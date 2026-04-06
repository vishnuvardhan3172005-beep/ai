
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
    
    // UI Elements
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiBtn = document.getElementById('saveApiBtn');
    const apiStatus = document.getElementById('apiStatus');
    const eyeBtn = document.getElementById('eyeBtn');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const errorBox = document.getElementById('errorBox');
    const outputSection = document.getElementById('outputSection');
    const notesOutput = document.getElementById('notesOutput');

    // Load Key on Startup
    window.onload = () => {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
        apiKeyInput.value = savedKey;
        updateApiStatus(true);
      }
    };

    saveApiBtn.onclick = () => {
      const key = apiKeyInput.value.trim();
      if (key.startsWith('AIza')) {
        localStorage.setItem('gemini_api_key', key);
        updateApiStatus(true);
        alert('Key saved securely in browser storage.');
      } else {
        alert('Invalid Gemini Key format (should start with AIza).');
      }
    };

    eyeBtn.onclick = () => {
      apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
    };

    function updateApiStatus(isActive) {
      apiStatus.textContent = isActive ? '● ACTIVE' : '● NOT SET';
      apiStatus.className = isActive ? 'api-status active' : 'api-status inactive';
    }

    generateBtn.onclick = async () => {
      const key = localStorage.getItem('gemini_api_key');
      const input = document.getElementById('lectureInput').value.trim();
      const style = document.getElementById('noteStyle').value;
      const detail = document.getElementById('detailLevel').value;

      if (!key) return showError("Please save your Gemini API Key first.");
      if (!input) return showError("Input cannot be empty.");

      setLoading(true);
      errorBox.style.display = 'none';

      try {
        const prompt = `Act as an expert academic scribe. Create ${detail} ${style} notes for this content: \n\n${input}`;
        
        const response = await fetch(`${API_URL}?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);
        
        const resultText = data.candidates[0].content.parts[0].text;
        notesOutput.innerText = resultText;
        outputSection.style.display = 'block';
        outputSection.scrollIntoView({ behavior: 'smooth' });

      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };

    function setLoading(isLoading) {
      generateBtn.disabled = isLoading;
      btnText.style.display = isLoading ? 'none' : 'inline';
      loader.style.display = isLoading ? 'block' : 'none';
    }

    function showError(msg) {
      errorBox.textContent = "Error: " + msg;
      errorBox.style.display = 'block';
    }

    document.getElementById('copyBtn').onclick = () => {
      navigator.clipboard.writeText(notesOutput.innerText);
      alert('Notes copied to clipboard!');
    };

    document.getElementById('clearBtn').onclick = () => {
      outputSection.style.display = 'none';
      notesOutput.innerText = '';
    };
  