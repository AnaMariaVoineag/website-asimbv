using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

/// <summary>
/// Approved event texts (short <see cref="EventItem.Description"/> + <see cref="EventItem.LongDescription"/>)
/// and the two events added after the original seed. <see cref="Apply"/> writes all of it in ONE
/// transaction at startup, so it reaches every database (SQLite file and Postgres in Docker) the same way.
/// It is idempotent: running it again changes nothing.
/// </summary>
public static class EventContentSync
{
    // Title/Date/Category/Images are only used when the event does not exist yet (it is inserted).
    // For existing events only Description and LongDescription are written.
    private sealed record EventContent(
        int Id,
        string Description,
        string LongDescription,
        string? Title = null,
        string? Date = null,
        string? Category = null,
        string? Images = null);

    private static readonly EventContent[] Items =
    [
        new(1,
            Description: "După ani de pregătiri, studenții de la Matematică și Informatică din Brașov au pus bazele ASIMBv.",
            LongDescription: """
            Povestea ASIMBv a început cu mult înainte de actul oficial. Încă din 2022, un grup de studenți ai Facultății de Matematică și Informatică din Brașov și-au propus să creeze o voce reală pentru colegii lor și au pornit pe drumul, uneori greoi, al birocrației necesare pentru înființarea unei asociații.

            Pe 6 octombrie 2024, după doi ani de muncă și perseverență, ASIMBv a luat naștere oficial și și-a început activitatea. Din acel moment, asociația și-a asumat misiunea de a transforma anii de facultate într-o experiență completă: a conectat studenții cu lideri din industria tehnologică, a dezvoltat proiecte inovatoare, a sprijinit inițiativele academice și a organizat activități care au făcut diferența.

            Acest început a pus bazele a tot ce a urmat: o comunitate construită de studenți, pentru studenți.
            """),

        new(2,
            Description: "Evenimentul de primire a studenților din anul I, organizat pe Colina Universității: primul contact cu viața universitară, cu facultatea și cu ASIMBv.",
            LongDescription: """
            Student Login este evenimentul prin care ASIMBv îi întâmpină pe noii studenți ai Facultății de Matematică și Informatică. Ediția din 2025 a avut loc pe 1 octombrie, pe Colina Universității, și a reunit boboci, colegi din anii mai mari și membri ai asociației într-un cadru relaxat.

            În aceeași perioadă, ASIMBv i-a întâmpinat pe noii veniți și la standul din facultate, unde aceștia au aflat despre misiunea, viziunea și valorile asociației și au putut consulta Ghidul Studentului 2025. Pentru mulți dintre ei, a fost primul pas către o experiență universitară activă și implicată.
            """),

        new(4,
            Description: "ASIMBv și-a prezentat misiunea în fața Uniunii Studenților din România și a devenit parte din rețeaua națională UNI.",
            LongDescription: """
            Afilierea la Uniunea Studenților din România a fost unul dintre cei mai importanți pași ai ASIMBv de la înființare. Cu ocazia unei întâlniri UNI, asociația a fost reprezentată de președintele ASIMBv, Teodor-Andrei Mincă, și de secretarul general, Cezar-Mihai Vieru-Potecu, care au prezentat cine suntem: o asociație fondată în 2024, care adună studenți dornici să se dezvolte personal și profesional și să construiască împreună idei, proiecte și evenimente.

            Prin acest parteneriat, ASIMBv a intrat într-o rețea de asociații studențești din toată țara, cu oportunități de schimb de experiență, formare și reprezentare dincolo de nivelul facultății. Pentru studenții brașoveni, asta a însemnat o voce mai puternică și o comunitate mai conectată.
            """),

        new(6,
            Description: "Studenții din anul II au întâlnit direct companii de tehnologie și au aflat ce oportunități de practică îi așteaptă.",
            LongDescription: """
            Târgul de practică pentru anul II a adus în Aula Universității Transilvania din Brașov mai multe companii din domeniul IT și al tehnologiei, printre care Arvato Systems, CANAM, Rebel Dot, Siemens, VASS, Trimble, Enovation și Waters. ASIMBv a promovat evenimentul în rândul studenților și a urmărit ca fiecare să poată participa.

            Programul a fost împărțit pe specializări, astfel încât fiecare grupă să aibă timp să discute cu reprezentanții companiilor. Studenții au putut afla direct de la angajatori ce presupune un stagiu de practică și ce oportunități li s-au deschis după el.
            """),

        new(7,
            Description: "Hackathon organizat la Facultatea de Matematică și Informatică, în care echipe de studenți au dezvoltat soluții software.",
            LongDescription: """
            Transilvania Codestorm@MI a revenit în 2026 cu o nouă ediție a hackathonului dedicat studenților pasionați de programare. Pe 24 și 25 aprilie, echipele s-au adunat la etajul 2 al Facultății de Matematică și Informatică din Brașov și au transformat idei în aplicații funcționale, într-un timp limitat și cu multă colaborare.

            Evenimentul a fost organizat împreună cu facultatea și a avut ca parteneri Siemens, Eviden, Rebel Dot, principal33 și VASS. ASIMBv a fost implicată în organizare prin voluntariat, alături de colegii care au făcut posibil ca totul să decurgă fără probleme.
            """),

        new(8,
            Description: "Workshop despre dezvoltarea web full-stack modernă cu Next.js, susținut de un student al asociației, în parteneriat cu BEST Brașov.",
            LongDescription: """
            ASIMBv și BEST Brașov au organizat împreună un workshop dedicat dezvoltării web moderne, pe 21 mai, în Aula Sergiu Chiriacescu. Un student din asociația noastră, Sebastian Șomu, speaker la BIT 2026, a susținut o prezentare despre dezvoltarea web full-stack cu Next.js și despre bunele practici pentru aplicații web moderne și scalabile, urmată de o aplicație web demonstrativă.

            A fost un curs interactiv și dinamic, în care studenții au văzut cum se construiește un proiect real, de la interfață până la partea de server. Evenimentul a arătat, totodată, ce poate aduce colaborarea dintre două organizații studențești.
            """),

        new(9,
            Description: "Delegația ASIMBv a participat la Adunarea Generală UNI și la Congresul Studenților din România, desfășurate la București.",
            LongDescription: """
            Între 21 și 24 mai, delegația ASIMBv a fost la București pentru Adunarea Generală UNI, un eveniment care a reunit asociații studențești din toată țara. Asociația a fost reprezentată de președintele ASIMBv, Teodor-Andrei Mincă, și de secretarul general, Cezar-Mihai Vieru-Potecu. Programul a inclus Congresul Studenților din România, desfășurat pe 22 mai sub mesajul „Fii piesa care întregește viitorul”.

            Participarea ne-a oferit ocazia să urmărim dezbaterile statutare, să facem schimb de idei cu alte asociații și să aducem în discuție perspectiva studenților din Brașov. A fost încă o confirmare că implicarea într-o rețea națională aduce experiență, contacte și proiecte comune.
            """),

        new(10,
            Description: "ASIMBv a fost voluntar la Zilele UNI din Brașov, evenimentul prin care Uniunea Studenților din România și-a sărbătorit cei 25 de ani de reprezentare studențească.",
            LongDescription: """
            În iulie, Brașovul a găzduit Zilele UNI, parte din aniversarea a 25 de ani de la înființarea Uniunii Studenților din România, sub mesajul „Vocea ta. A noastră. A tuturor.”. Programul a inclus Gala UNI 25, parada asociațiilor, un treasure hunt și activități sportive.

            Între 17 și 19 iulie, membrii ASIMBv au fost voluntari, alături de ASSM, ajutând la organizarea activităților și la buna desfășurare a evenimentelor. Pentru echipă, a fost o experiență intensă de lucru în echipă și o ocazie de a întâlni studenți implicați din toată țara.
            """),

        new(11,
            Description: "Bootcamp de formare pentru asociațiile studențești din zona Centru-Nord și Vest, desfășurat la Sibiu, cu workshopuri despre lucrul în echipă și leadership.",
            LongDescription: """
            Între 21 și 23 august, Sibiul a găzduit bootcamp-ul UNI pentru zona Centru-Nord și Vest, un eveniment de formare la care au participat reprezentanți ai asociațiilor studențești din regiune. ASIMBv a fost reprezentată de doi lideri ai asociației: secretarul general, Cezar-Mihai Vieru-Potecu, și liderul departamentului IT, Sebastian Șomu.

            Pe parcursul celor trei zile au avut loc sesiuni de lucru și workshopuri despre lucrul în echipă și leadership, în care au fost parcurse concepte generale despre cum se colaborează, cum se conduce și cum se motivează o echipă în cadrul unei asociații. Ne-am întors în Brașov cu idei și metode noi pe care le putem aplica în proiectele noastre.
            """),

        // Id 12 (Concurs Național de Dezbateri CNDOS) has no approved text yet and is left untouched.

        new(13,
            Description: "ASIMBv a fost prezentă la cea de-a LXXIII-a Adunare Generală UNI, desfășurată la Alba Iulia, alături de asociații studențești din toată țara.",
            LongDescription: """
            Între 10 și 13 septembrie, Alba Iulia a găzduit a LXXIII-a Adunare Generală a Uniunii Studenților din România. Sute de studenți din asociații din toată țara s-au întâlnit pentru ședințele statutare, în care s-au stabilit direcțiile mișcării studențești pentru noul an universitar.

            Delegația ASIMBv a fost formată din președintele asociației, Teodor-Andrei Mincă, secretarul general, Cezar-Mihai Vieru-Potecu, președintele departamentului PR, Larisa Zaheu, și voluntarii Florin-Adrian Mincu și Andrei Șerbănescu. Împreună au reprezentat interesele studenților brașoveni și au urmărit deciziile luate. Pe lângă lucrul din sală, au contat și pauzele, activitățile comune și întâlnirile cu colegii din alte orașe, care au făcut din Adunarea Generală mai mult decât o ședință.
            """),

        new(14,
            Description: "Evenimentul de bun venit pentru noua generație de studenți ai facultății, organizat pe Colina Universității, la început de an universitar.",
            LongDescription: """
            Student Login a revenit și în 2026, pe 1 octombrie, tot pe Colina Universității, cu scopul de a-i întâmpina pe noii studenți ai Facultății de Matematică și Informatică. A fost o seară de cunoaștere între boboci, colegi din anii mai mari și membri ai asociației.

            ASIMBv le-a prezentat noilor veniți cine suntem, ce proiecte avem și cum se pot implica. Pentru mulți dintre ei, Student Login a fost primul contact cu viața de student și un bun început de an universitar.
            """),

        // --- New events (inserted when missing). Ids follow Student Login 2026 (14): GitHub DevDays = 15, Aniversare 2 ani = 16. ---

        new(15,
            Title: "GitHub DevDays Brașov",
            Date: "31 octombrie 2026",
            Category: "Workshop",
            Images: """["/poze_evenimente/GitHub_DevDays/img1.jpg","/poze_evenimente/GitHub_DevDays/img2.jpg"]""",
            Description: "Workshop dedicat GitHub Copilot, susținut de un reprezentant Microsoft, în care participanții au învățat prin exerciții practice cum pot dezvolta software mai eficient cu ajutorul inteligenței artificiale.",
            LongDescription: """
            GitHub DevDays Brașov a fost un workshop dedicat GitHub Copilot, organizat de ASIMBv pe 31 octombrie și susținut de Alexandru-Răzvan Olariu, reprezentant Microsoft. Împreună am descoperit cum poate fi făcut procesul de dezvoltare software mai eficient cu ajutorul inteligenței artificiale, inclusiv prin lucrul cu Copilot din linia de comandă.

            Cei peste 20 de participanți au explorat atât conceptele teoretice de bază, cât și aplicarea lor în practică, prin exerciții interactive structurate pe diferite niveluri de dificultate. Între module, quiz-uri interactive i-au ajutat să își verifice, pas cu pas, cât de multe au învățat.

            A fost un eveniment construit pe principiul „learning by doing”, din care participanții au plecat cu abilități pe care le pot aplica direct în propriile proiecte.
            """),

        new(16,
            Title: "Aniversarea a 2 ani de ASIMBv",
            Date: "6 octombrie 2026",
            Category: "Social",
            Images: """["/poze_evenimente/Aniversare_2_ani_ASIMBV/img2.jpg","/poze_evenimente/Aniversare_2_ani_ASIMBV/img1.jpeg"]""",
            Description: "ASIMBv a sărbătorit doi ani de activitate, printr-o seară de game night și karaoke alături de comunitatea ei.",
            LongDescription: """
            Pe 6 octombrie 2026, ASIMBv a împlinit doi ani de la înființare. Doi ani în care asociația a devenit o prezență constantă în spațiul universitar brașovean, apropiind comunitatea studenților din Facultatea de Matematică și Informatică de cea din oraș.

            Ne-am amintit de unde am pornit: fondatorii, împreună cu facultatea, au preluat inițiativa, au organizat ședințe, au elaborat documente, au stabilit departamente și, mai ales, au adus oameni. După multe piedici, asociația a ajuns și la nivel național, alăturându-se familiei UNI, iar implicarea în Zilele Uniunii desfășurate la Brașov în iulie ne-a dat ocazia să arătăm spiritul de voluntariat al ASIMBv. În facultate, am fost mereu aproape de colegi, fie că a fost vorba de Hackathon, de feedback-ul pentru profesori, de târgul de practică sau de primirea bobocilor la Student Login.

            Seara aceea am marcat-o printr-un game night și karaoke, într-o atmosferă relaxată, alături de comunitatea noastră. Ne-am fi dorit să fim și mai ocupați decât am fost, iar de acum înainte sperăm să nu ne oprim din a oferi oportunități comunității pe care o reprezentăm. La mulți ani, ASIMBv!
            """),
    ];

    // The working copy may have CRLF line endings (Windows autocrlf); the stored text always uses "\n".
    private static string Clean(string text) => text.ReplaceLineEndings("\n");

    /// <summary>
    /// Updates the texts of existing events and inserts the missing new ones, all in one transaction.
    /// If anything fails the transaction is rolled back and the database is left exactly as it was.
    /// </summary>
    public static void Apply(AppDbContext db)
    {
        using var transaction = db.Database.BeginTransaction();
        try
        {
            var ids = Items.Select(i => i.Id).ToList();
            var existing = db.Events.Where(e => ids.Contains(e.Id)).ToDictionary(e => e.Id);

            foreach (var item in Items)
            {
                if (existing.TryGetValue(item.Id, out var current))
                {
                    current.Description = Clean(item.Description);
                    current.LongDescription = Clean(item.LongDescription);
                    if (item.Title is not null)
                    {
                        // New-style entries are fully managed here, so re-applying (e.g. after the id swap) fixes old rows.
                        current.Title = item.Title;
                        current.Date = item.Date ?? current.Date;
                        current.Category = item.Category ?? current.Category;
                        current.Images = item.Images;
                    }
                }
                else if (item.Title is not null)
                {
                    db.Events.Add(new EventItem
                    {
                        Id = item.Id,
                        Title = item.Title,
                        Date = item.Date ?? string.Empty,
                        Category = item.Category ?? "Social",
                        Images = item.Images,
                        Description = Clean(item.Description),
                        LongDescription = Clean(item.LongDescription),
                    });
                }
                // An approved text for an event that no longer exists is skipped on purpose.
            }

            db.SaveChanges();

            // Rows were inserted with explicit ids: move the Postgres identity sequence past them,
            // otherwise the next POST /api/events would try to reuse id 15.
            if (db.Database.IsNpgsql())
            {
                db.Database.ExecuteSqlRaw(
                    "SELECT setval(pg_get_serial_sequence('\"Events\"', 'Id'), (SELECT COALESCE(MAX(\"Id\"), 1) FROM \"Events\"))");
            }

            transaction.Commit();
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            Console.WriteLine($"[Event Content Sync] Rolled back, nothing was changed: {ex.Message}");
        }
    }
}
