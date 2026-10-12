using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<EventItem> Events => Set<EventItem>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<NewsletterSubscriber> NewsletterSubscribers => Set<NewsletterSubscriber>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<EventItem>().HasData(
            new EventItem
            {
                Id = 1,
                Date = "6 octombrie 2024",
                Title = "Înființare ASIMBv",
                Category = "Social",
                Description = "Punctul de pornire al asociației: un grup de studenți motivați de la Facultatea de Matematică și Informatică Brașov au unit forțele pentru a crea vocea oficială a studenților din cadrul facultății.",
                Images = "[\"/poze_evenimente/Infiintare_ASIMBV.png\"]"
            },
            new EventItem
            {
                Id = 2,
                Date = "1 octombrie 2025",
                Title = "Student Login",
                Category = "Social",
                Description = "Evenimentul emblematic dedicat noilor studenți din anul 1, menit să le ofere ghidare în cadrul mediului universitar, networking și un start excelent în viața de facultate.",
                Images = "[\"/poze_evenimente/Student_Login_2025/img1.png\",\"/poze_evenimente/Student_Login_2025/img2.png\",\"/poze_evenimente/Student_Login_2025/img3.png\",\"/poze_evenimente/Student_Login_2025/img4.png\"]"
            },
            new EventItem
            {
                Id = 4,
                Date = "28 noiembrie 2025",
                Title = "Afiliere Uniunea Studenților din România UNI",
                Category = "Social",
                Description = "Recunoașterea și afilierea oficială a asociației în cadrul federației naționale UNI, deschizând oportunități extinse de reprezentare.",
                Images = "[\"/poze_evenimente/Afiliere_Uniunea_Studenților_din_România_UNI/img1.png\",\"/poze_evenimente/Afiliere_Uniunea_Studenților_din_România_UNI/img2.png\"]"
            },
            new EventItem
            {
                Id = 6,
                Date = "3 Martie 2026",
                Title = "Promovare Târg Practică Anul II",
                Category = "Workshop",
                Description = "Prezentarea oportunităților de internship și stagii de practică la companii tech partenere din Brașov pentru studenții facultății.",
                Images = "[\"/poze_evenimente/Promovare_targ_practica_anul_II/img1.png\",\"/poze_evenimente/Promovare_targ_practica_anul_II/img2.png\",\"/poze_evenimente/Promovare_targ_practica_anul_II/img3.png\"]"
            },
            new EventItem
            {
                Id = 7,
                Date = "24-25 aprilie 2026",
                Title = "Hackathon Transilvania Codestorm@MI",
                Category = "Competition",
                Description = "Competiție intensivă de 24 de ore în care echipe de studenți dezvoltă aplicații software inovatoare și concurează pentru premii speciale.",
                Images = "[\"/poze_evenimente/voluntariat_Hackathon_Transilvania_Codestorm@MI/img1.png\",\"/poze_evenimente/voluntariat_Hackathon_Transilvania_Codestorm@MI/img2.png\",\"/poze_evenimente/voluntariat_Hackathon_Transilvania_Codestorm@MI/img3.png\",\"/poze_evenimente/voluntariat_Hackathon_Transilvania_Codestorm@MI/img4.png\"]"
            },
            new EventItem
            {
                Id = 8,
                Date = "21 mai 2026",
                Title = "Workshop ASIMBv x BEST Brașov",
                Category = "Workshop",
                Description = "Atelier practic de dezvoltare abilități tehnice și soft skills organizat în parteneriat cu organizația inginerească BEST Brașov.",
                Images = "[\"/poze_evenimente/workshop_asimbv_best/img1.png\"]"
            },
            new EventItem
            {
                Id = 9,
                Date = "21-24 mai 2026",
                Title = "Adunarea Generală UNI București",
                Category = "Social",
                Description = "Delegația ASIMBv a participat activ la dezbaterile și deciziile statutare din cadrul Adunării Generale Naționale UNI.",
                Images = "[\"/poze_evenimente/AG_UNI_Bucuresti/img1.png\",\"/poze_evenimente/AG_UNI_Bucuresti/img2.png\"]"
            },
            new EventItem
            {
                Id = 10,
                Date = "17-19 iulie 2026",
                Title = "Voluntariat Zilele UNI x ASIMBv x ASSM",
                Category = "Social",
                Description = "Trei zile pline de activități comunitare, teambuilding și implicare socială alături de asociațiile partenere din țară.",
                Images = "[\"/poze_evenimente/voluntariat_Zilele_UNI_x_ASIMBv_x_ASSM/img1.png\",\"/poze_evenimente/voluntariat_Zilele_UNI_x_ASIMBv_x_ASSM/img2.png\"]"
            },
            new EventItem
            {
                Id = 11,
                Date = "21-23 August 2026",
                Title = "Bootcamp Teamwork & Leadership UNI",
                Category = "Workshop",
                Description = "Tabără de formare intensivă axată pe tehnici de management de proiect, comunicare eficientă și coordonare de echipe mari.",
                Images = "[\"/poze_evenimente/bootcamp_uni_centru_vest/img1.png\",\"/poze_evenimente/bootcamp_uni_centru_vest/img2.png\"]"
            },
            new EventItem
            {
                Id = 12,
                Date = "Septembrie 2026",
                Title = "Concurs Național de Dezbateri CNDOS",
                Category = "Competition",
                Description = "Participarea și susținerea studenților brașoveni în cadrul competiției academice de dezbateri și argumentare structurată.",
                FormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfCEd2yubl7p6Zh-fH2nwbRa0A2lX3ecQldH_Kiq-fvC-mdgw/viewform?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
            },
            new EventItem
            {
                Id = 13,
                Date = "10-13 Septembrie 2026",
                Title = "Adunarea Generală UNI Alba Iulia",
                Category = "Social",
                Description = "Reprezentarea intereselor studenților brașoveni și stabilirea direcțiilor strategice ale mișcării studențești pentru noul an universitar.",
                Images = "[\"/poze_evenimente/AG_UNI_Alba_Iulia/img1.png\"]"
            },
            new EventItem
            {
                Id = 14,
                Date = "1 octombrie 2026",
                Title = "Student Login Ediția 2026",
                Category = "Social",
                Description = "Ghidul complet de bun venit pentru noua generație de boboci la Facultatea de Matematică și Informatică.",
                Images = "[\"/poze_evenimente/Student_Login_2026/img2.png\",\"/poze_evenimente/Student_Login_2026/img3.png\"]"
            }
        );
    }
}
