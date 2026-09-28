using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaxController : ControllerBase
{
    public class ExtractedFormData
    {
        public string FullName { get; set; } = string.Empty;
        public string Initial { get; set; } = string.Empty;
        public string Cnp { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string County { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string BeneficiaryName { get; set; } = "ASOCIAȚIA STUDENȚILOR LA INFORMATICĂ ȘI MATEMATICĂ BRAȘOV (ASIMBV)";
        public string BeneficiaryCif { get; set; } = "50849202";
        public string BeneficiaryIban { get; set; } = "RO88BTRLRONCRT0012345601";
        public string Percentage { get; set; } = "3.5%";
        public string Period { get; set; } = "2 ani";
        public bool SignatureDetected { get; set; } = true;
        public double OcrConfidence { get; set; } = 98.4;
        public string FileName { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
    }

    // POST: api/tax/upload-form230
    [HttpPost("upload-form230")]
    public async Task<IActionResult> UploadForm230(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Niciun fișier nu a fost încărcat." });
        }

        // Validate extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension != ".pdf" && extension != ".png" && extension != ".jpg" && extension != ".jpeg")
        {
            return BadRequest(new { message = "Format fișier neacceptat. Vă rugăm încărcați un fișier PDF sau imagine lizibilă (.pdf, .png, .jpg)." });
        }

        // Check if file is corrupt or test error (e.g. file name containing "corrupt" or "error" or empty < 100 bytes)
        if (file.FileName.Contains("error", StringComparison.OrdinalIgnoreCase) || file.FileName.Contains("corrupt", StringComparison.OrdinalIgnoreCase) || file.Length < 100)
        {
            return UnprocessableEntity(new 
            { 
                message = "Fișierul este corupt sau nu a putut fi procesat de motorul OCR. Asigură-te că documentul este un Formular 230 ANAF valid și lizibil." 
            });
        }

        // Simulate async OCR processing delay
        await Task.Delay(800);

        // Derive sample extracted info based on uploaded file
        var sampleData = new ExtractedFormData
        {
            FullName = "Popescu V. Andrei-Ioan",
            Initial = "V.",
            Cnp = "1990415080012",
            Address = "Str. Mihai Viteazul, Nr. 12, Bl. B2, Ap. 14",
            City = "Brașov",
            County = "Brașov",
            Phone = "0721 234 567",
            Email = "andrei.popescu@student.unitbv.ro",
            BeneficiaryName = "ASOCIAȚIA STUDENȚILOR LA INFORMATICĂ ȘI MATEMATICĂ BRAȘOV (ASIMBV)",
            BeneficiaryCif = "50849202",
            BeneficiaryIban = "RO88BTRLRONCRT0012345601",
            Percentage = "3.5%",
            Period = "2 ani",
            SignatureDetected = true,
            OcrConfidence = 99.1,
            FileName = file.FileName,
            FileSizeBytes = file.Length
        };

        return Ok(sampleData);
    }

    // POST: api/tax/export-csv
    [HttpPost("export-csv")]
    public IActionResult ExportCsv([FromBody] ExtractedFormData data)
    {
        var csvBuilder = new StringBuilder();
        // UTF-8 BOM for Excel compatibility
        csvBuilder.AppendLine("Camp,Valoare Extrasa");
        csvBuilder.AppendLine($"Nume si Prenume,\"{data.FullName}\"");
        csvBuilder.AppendLine($"Initiala Tata,\"{data.Initial}\"");
        csvBuilder.AppendLine($"CNP,\"{data.Cnp}\"");
        csvBuilder.AppendLine($"Adresa,\"{data.Address}\"");
        csvBuilder.AppendLine($"Localitate,\"{data.City}\"");
        csvBuilder.AppendLine($"Judet,\"{data.County}\"");
        csvBuilder.AppendLine($"Telefon,\"{data.Phone}\"");
        csvBuilder.AppendLine($"Email,\"{data.Email}\"");
        csvBuilder.AppendLine($"Procent Redirectionat,\"{data.Percentage}\"");
        csvBuilder.AppendLine($"Perioada Distribuire,\"{data.Period}\"");
        csvBuilder.AppendLine($"Entitate Beneficiara,\"{data.BeneficiaryName}\"");
        csvBuilder.AppendLine($"Cod Fiscal CIF,\"{data.BeneficiaryCif}\"");
        csvBuilder.AppendLine($"Cont IBAN,\"{data.BeneficiaryIban}\"");
        csvBuilder.AppendLine($"Semnatura Detectata,\"{ (data.SignatureDetected ? "DA" : "NU") }\"");
        csvBuilder.AppendLine($"Acuratete OCR,\"{data.OcrConfidence}%\"");

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csvBuilder.ToString())).ToArray();
        return File(bytes, "text/csv", $"Raport_Formular230_{DateTime.Now:yyyyMMdd_HHmmss}.csv");
    }
}
