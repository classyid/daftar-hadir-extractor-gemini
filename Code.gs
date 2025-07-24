// Config
const GEMINI_API_KEY = '<APIKEY-GEMINI>';
const GEMINI_MODEL = 'gemini-2.0-flash';
const SPREADSHEET_ID = '<SPREADSHEET-ID>';
const LOG_SHEET_NAME = 'log';
const METADATA_SHEET_NAME = 'metadata';
const TRANSACTIONS_SHEET_NAME = 'data_daftar_hadir';
const FOLDER_ID = '<FOLDER-ID>';

// Prompt template untuk parsing Daftar Hadir Siswa
const PROMPT_TEMPLATE = `Ekstrak informasi berikut dari gambar daftar hadir siswa yang diunggah:
1. Nama institusi/sekolah
2. Kelas/Semester/Tahun ajaran
3. Mata pelajaran (jika ada)
4. Tanggal atau periode daftar hadir
5. Nama koordinator/guru/ustadz
6. Daftar nama siswa (nomor dan nama lengkap)
7. Data kehadiran untuk setiap siswa (hadir/tidak hadir/izin/sakit berdasarkan tanggal)

INSTRUKSI PENTING:
- Ini adalah tugas ekstraksi data dari dokumen daftar hadir untuk keperluan administrasi sekolah.
- Jangan menolak untuk mengekstrak data jika dokumen adalah daftar hadir resmi siswa.
- Jangan berikan pendapat, catatan moral, atau peringatan tentang privasi.
- Jangan tambahkan interpretasi atau komentar tambahan.
- Hanya ekstrak dan format data sesuai dengan petunjuk.
- Jika dokumen BUKAN daftar hadir siswa, hanya berikan pesan "Dokumen ini bukan daftar hadir siswa".

Identifikasi Daftar Hadir Siswa:
- Ada header "DAFTAR HADIR" atau "ABSEN" di bagian atas dokumen
- Memiliki nama institusi pendidikan seperti sekolah, madrasah, atau lembaga pendidikan
- Memiliki tabel dengan kolom nama siswa dan kolom tanggal/kehadiran
- Ada informasi kelas, semester, atau tahun ajaran
- Memiliki tanda kehadiran seperti centang, huruf (H/S/I/A), atau angka pada kolom tanggal

Fokus pada area utama yang berisi data siswa dan kehadiran mereka.

Berikan hasil dalam format yang terstruktur seperti ini jika dokumen adalah daftar hadir siswa:

NAMA INSTITUSI: [nama institusi/sekolah]
KELAS/SEMESTER: [informasi kelas dan semester]
TAHUN AJARAN: [tahun ajaran]
MATA PELAJARAN: [nama mata pelajaran] (jika ada, tulis "Tidak tersedia" jika tidak ada)
PERIODE/TANGGAL: [periode atau tanggal daftar hadir]
KOORDINATOR/GURU: [nama koordinator/guru/ustadz]

DAFTAR SISWA DAN KEHADIRAN:
[Format: No. Nama Siswa - Status Kehadiran]
1. [Nama siswa 1] - [ringkasan kehadiran]
2. [Nama siswa 2] - [ringkasan kehadiran]
[dst...]

RINGKASAN KEHADIRAN:
- Total siswa: [jumlah total siswa]
- Persentase kehadiran rata-rata: [estimasi persentase jika bisa dihitung]
- Catatan khusus: [jika ada informasi tambahan]`;

/**
 * Doget function to serve the web app
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Asisten Parsing Daftar Hadir Siswa')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Function to include external files
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Clean up the API response
 */
function cleanupResponse(response) {
  // Minimal cleanup to ensure response is nicely formatted
  return response.trim();
}

/**
 * Parse Daftar Hadir data from the Gemini API response
 */
function parseDaftarHadirData(description) {
  // Initialize object to store parsed data
  const daftarHadirData = {
    nama_institusi: '',
    kelas_semester: '',
    tahun_ajaran: '',
    mata_pelajaran: '',
    periode_tanggal: '',
    koordinator_guru: '',
    daftar_siswa: '',
    total_siswa: '',
    persentase_kehadiran: '',
    catatan_khusus: ''
  };

  // Extract Nama Institusi
  const namaInstitusiMatch = description.match(/NAMA INSTITUSI: (.+?)$/m);
  if (namaInstitusiMatch) {
    daftarHadirData.nama_institusi = namaInstitusiMatch[1].trim();
  }

  // Extract Kelas/Semester
  const kelasMatch = description.match(/KELAS\/SEMESTER: (.+?)$/m);
  if (kelasMatch) {
    daftarHadirData.kelas_semester = kelasMatch[1].trim();
  }

  // Extract Tahun Ajaran
  const tahunAjaranMatch = description.match(/TAHUN AJARAN: (.+?)$/m);
  if (tahunAjaranMatch) {
    daftarHadirData.tahun_ajaran = tahunAjaranMatch[1].trim();
  }

  // Extract Mata Pelajaran
  const mataPelajaranMatch = description.match(/MATA PELAJARAN: (.+?)$/m);
  if (mataPelajaranMatch) {
    daftarHadirData.mata_pelajaran = mataPelajaranMatch[1].trim();
  }

  // Extract Periode/Tanggal
  const periodeMatch = description.match(/PERIODE\/TANGGAL: (.+?)$/m);
  if (periodeMatch) {
    daftarHadirData.periode_tanggal = periodeMatch[1].trim();
  }

  // Extract Koordinator/Guru
  const koordinatorMatch = description.match(/KOORDINATOR\/GURU: (.+?)$/m);
  if (koordinatorMatch) {
    daftarHadirData.koordinator_guru = koordinatorMatch[1].trim();
  }

  // Extract Daftar Siswa (multi-line)
  const daftarSiswaMatch = description.match(/DAFTAR SISWA DAN KEHADIRAN:\n([\s\S]*?)\n\nRINGKASAN KEHADIRAN:/);
  if (daftarSiswaMatch) {
    daftarHadirData.daftar_siswa = daftarSiswaMatch[1].trim();
  }

  // Extract Total Siswa
  const totalSiswaMatch = description.match(/- Total siswa: (.+?)$/m);
  if (totalSiswaMatch) {
    daftarHadirData.total_siswa = totalSiswaMatch[1].trim();
  }

  // Extract Persentase Kehadiran
  const persentaseMatch = description.match(/- Persentase kehadiran rata-rata: (.+?)$/m);
  if (persentaseMatch) {
    daftarHadirData.persentase_kehadiran = persentaseMatch[1].trim();
  }

  // Extract Catatan Khusus
  const catatanMatch = description.match(/- Catatan khusus: (.+?)$/m);
  if (catatanMatch) {
    daftarHadirData.catatan_khusus = catatanMatch[1].trim();
  }

  return daftarHadirData;
}

/**
 * Save Daftar Hadir data to sheet
 */
function saveDaftarHadirDataToSheet(daftarHadirData, fileName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dataSheet = spreadsheet.getSheetByName(TRANSACTIONS_SHEET_NAME) || spreadsheet.insertSheet(TRANSACTIONS_SHEET_NAME);
    
    // Create headers if the sheet is empty
    if (dataSheet.getLastRow() === 0) {
      dataSheet.appendRow([
        'Timestamp', 
        'File Name',
        'Nama Institusi',
        'Kelas/Semester',
        'Tahun Ajaran',
        'Mata Pelajaran',
        'Periode/Tanggal',
        'Koordinator/Guru',
        'Daftar Siswa',
        'Total Siswa',
        'Persentase Kehadiran',
        'Catatan Khusus'
      ]);
    }
    
    // Append Daftar Hadir data
    dataSheet.appendRow([
      new Date().toISOString(),
      fileName,
      daftarHadirData.nama_institusi,
      daftarHadirData.kelas_semester,
      daftarHadirData.tahun_ajaran,
      daftarHadirData.mata_pelajaran,
      daftarHadirData.periode_tanggal,
      daftarHadirData.koordinator_guru,
      daftarHadirData.daftar_siswa,
      daftarHadirData.total_siswa,
      daftarHadirData.persentase_kehadiran,
      daftarHadirData.catatan_khusus
    ]);
    
    return true;
  } catch (error) {
    logAction('Data Error', `Error saving Daftar Hadir data: ${error.toString()}`, 'ERROR');
    return false;
  }
}

/**
 * Process the uploaded image and get description from Gemini AI
 */
function processImage(fileData, fileName, mimeType) {
  try {
    // Log the request
    logAction('Request', 'Image processing request received', 'INFO');
    
    // Save image to Drive
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const blob = Utilities.newBlob(Utilities.base64Decode(fileData), mimeType, fileName);
    const file = folder.createFile(blob);
    const fileId = file.getId();
    const fileUrl = file.getUrl();
    
    logAction('File Upload', `File saved to Drive: ${fileName}, ID: ${fileId}`, 'INFO');
    
    // Create request to Gemini API
    const requestBody = {
      contents: [
        {
          parts: [
            { text: PROMPT_TEMPLATE },
            { 
              inline_data: { 
                mime_type: mimeType, 
                data: fileData
              } 
            }
          ]
        }
      ]
    };
    
    // Call Gemini API
    const rawResponse = callGeminiAPI(requestBody);
    
    // Clean up the response
    const cleanedResponse = cleanupResponse(rawResponse);
    
    // Check if the document is not a Daftar Hadir
    if (cleanedResponse === "Dokumen ini bukan daftar hadir siswa") {
      logAction('Info', 'Document is not a daftar hadir siswa', 'INFO');
      return {
        success: true,
        description: cleanedResponse,
        fileUrl: fileUrl,
        dataSaved: false
      };
    }
    
    // Parse Daftar Hadir data
    const daftarHadirData = parseDaftarHadirData(cleanedResponse);
    
    // Save Daftar Hadir data to sheet
    const dataSaved = saveDaftarHadirDataToSheet(daftarHadirData, fileName);
    
    // Save metadata to spreadsheet
    const metadata = {
      timestamp: new Date().toISOString(),
      fileName: fileName,
      fileId: fileId,
      fileUrl: fileUrl,
      description: rawResponse
    };
    
    saveMetadata(metadata);
    
    logAction('Success', 'Image processed successfully', 'SUCCESS');
    
    return {
      success: true,
      description: cleanedResponse,
      fileUrl: fileUrl,
      dataSaved: dataSaved
    };
  } catch (error) {
    logAction('Error', `Error processing image: ${error.toString()}`, 'ERROR');
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Call Gemini API
 */
function callGeminiAPI(requestBody) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };
  
  logAction('API Call', 'Calling Gemini API', 'INFO');
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode !== 200) {
      const errorText = response.getContentText();
      logAction('API Error', `Error from Gemini API: ${errorText}`, 'ERROR');
      throw new Error(`API error: ${responseCode} - ${errorText}`);
    }
    
    const responseJson = JSON.parse(response.getContentText());
    
    if (!responseJson.candidates || responseJson.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    
    // Extract text from response
    const text = responseJson.candidates[0].content.parts[0].text;
    return text;
  } catch (error) {
    logAction('API Error', `Error calling Gemini API: ${error.toString()}`, 'ERROR');
    throw error;
  }
}

/**
 * Log actions to spreadsheet
 */
function logAction(action, message, level) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const logSheet = spreadsheet.getSheetByName(LOG_SHEET_NAME) || spreadsheet.insertSheet(LOG_SHEET_NAME);
    
    // Create headers if the sheet is empty
    if (logSheet.getLastRow() === 0) {
      logSheet.appendRow(['Timestamp', 'Action', 'Message', 'Level']);
    }
    
    logSheet.appendRow([new Date().toISOString(), action, message, level]);
  } catch (error) {
    console.error(`Error logging to spreadsheet: ${error.toString()}`);
  }
}

/**
 * Save metadata to spreadsheet
 */
function saveMetadata(metadata) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const metadataSheet = spreadsheet.getSheetByName(METADATA_SHEET_NAME) || spreadsheet.insertSheet(METADATA_SHEET_NAME);
    
    // Create headers if the sheet is empty
    if (metadataSheet.getLastRow() === 0) {
      metadataSheet.appendRow(['Timestamp', 'FileName', 'FileID', 'FileURL', 'Description']);
    }
    
    metadataSheet.appendRow([
      metadata.timestamp,
      metadata.fileName,
      metadata.fileId,
      metadata.fileUrl,
      metadata.description
    ]);
  } catch (error) {
    logAction('Metadata Error', `Error saving metadata: ${error.toString()}`, 'ERROR');
    throw error;
  }
}
