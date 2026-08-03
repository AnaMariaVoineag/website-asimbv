using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/members")]
public class MembersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MembersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers(
        [FromQuery] string? faculty,
        [FromQuery] short? yearOfStudy,
        [FromQuery] bool? isActive)
    {
        var query = _context.Members.AsQueryable();

        if (!string.IsNullOrWhiteSpace(faculty))
        {
            query = query.Where(m => m.Faculty.ToLower() == faculty.ToLower());
        }

        if (yearOfStudy.HasValue)
        {
            query = query.Where(m => m.YearOfStudy == yearOfStudy.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(m => m.IsActive == isActive.Value);
        }

        var members = await query
            .OrderBy(m => m.LastName)
            .ThenBy(m => m.FirstName)
            .Select(m => new MemberDto
            {
                Id = m.Id,
                FirstName = m.FirstName,
                LastName = m.LastName,
                Email = m.Email,
                Phone = m.Phone,
                Faculty = m.Faculty,
                YearOfStudy = m.YearOfStudy,
                IsActive = m.IsActive,
                JoinedAt = m.JoinedAt,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt
            })
            .ToListAsync();

        return Ok(members);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MemberDto>> GetMember(int id)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null)
        {
            return NotFound(new { message = $"Member with ID {id} was not found." });
        }

        var dto = new MemberDto
        {
            Id = member.Id,
            FirstName = member.FirstName,
            LastName = member.LastName,
            Email = member.Email,
            Phone = member.Phone,
            Faculty = member.Faculty,
            YearOfStudy = member.YearOfStudy,
            IsActive = member.IsActive,
            JoinedAt = member.JoinedAt,
            CreatedAt = member.CreatedAt,
            UpdatedAt = member.UpdatedAt
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<MemberDto>> CreateMember(CreateMemberDto dto)
    {
        if (await _context.Members.AnyAsync(m => m.Email.ToLower() == dto.Email.ToLower()))
        {
            return BadRequest(new { message = $"A member with the email '{dto.Email}' already exists." });
        }

        var member = new Member
        {
            // Id is auto-incremented by PostgreSQL
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Faculty = dto.Faculty,
            YearOfStudy = dto.YearOfStudy,
            IsActive = true,
            JoinedAt = dto.JoinedAt,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        var resultDto = new MemberDto
        {
            Id = member.Id,
            FirstName = member.FirstName,
            LastName = member.LastName,
            Email = member.Email,
            Phone = member.Phone,
            Faculty = member.Faculty,
            YearOfStudy = member.YearOfStudy,
            IsActive = member.IsActive,
            JoinedAt = member.JoinedAt,
            CreatedAt = member.CreatedAt,
            UpdatedAt = member.UpdatedAt
        };

        return CreatedAtAction(nameof(GetMember), new { id = member.Id }, resultDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMember(int id, UpdateMemberDto dto)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null)
        {
            return NotFound(new { message = $"Member with ID {id} was not found." });
        }

        if (member.Email.ToLower() != dto.Email.ToLower() && 
            await _context.Members.AnyAsync(m => m.Email.ToLower() == dto.Email.ToLower()))
        {
            return BadRequest(new { message = $"A member with the email '{dto.Email}' already exists." });
        }

        member.FirstName = dto.FirstName;
        member.LastName = dto.LastName;
        member.Email = dto.Email;
        member.Phone = dto.Phone;
        member.Faculty = dto.Faculty;
        member.YearOfStudy = dto.YearOfStudy;
        member.IsActive = dto.IsActive;
        member.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Role assignment management

    [HttpGet("{id}/roles")]
    public async Task<ActionResult<IEnumerable<MemberRoleDto>>> GetMemberRoles(int id)
    {
        if (!await _context.Members.AnyAsync(m => m.Id == id))
        {
            return NotFound(new { message = $"Member with ID {id} was not found." });
        }

        var roles = await _context.MemberRoles
            .Include(mr => mr.Role)
            .Include(mr => mr.AssignedBy)
            .Where(mr => mr.MemberId == id)
            .Select(mr => new MemberRoleDto
            {
                Id = mr.Id,
                RoleId = mr.RoleId,
                RoleName = mr.Role.Name,
                AssignedById = mr.AssignedById,
                AssignedByName = mr.AssignedBy != null ? $"{mr.AssignedBy.FirstName} {mr.AssignedBy.LastName}" : null,
                ValidFrom = mr.ValidFrom,
                ValidUntil = mr.ValidUntil
            })
            .ToListAsync();

        return Ok(roles);
    }

    [HttpPost("{id}/roles")]
    public async Task<ActionResult<MemberRoleDto>> AssignRole(int id, AssignRoleDto dto)
    {
        if (!await _context.Members.AnyAsync(m => m.Id == id))
        {
            return NotFound(new { message = $"Member with ID {id} was not found." });
        }

        if (!await _context.Roles.AnyAsync(r => r.Id == dto.RoleId))
        {
            return BadRequest(new { message = $"Role with ID {dto.RoleId} does not exist." });
        }

        if (dto.AssignedById.HasValue && !await _context.Members.AnyAsync(m => m.Id == dto.AssignedById.Value))
        {
            return BadRequest(new { message = $"Assigner member with ID {dto.AssignedById} does not exist." });
        }

        var memberRole = new MemberRole
        {
            MemberId = id,
            RoleId = dto.RoleId,
            AssignedById = dto.AssignedById,
            ValidFrom = dto.ValidFrom,
            ValidUntil = dto.ValidUntil,
            CreatedAt = DateTime.UtcNow
        };

        _context.MemberRoles.Add(memberRole);
        await _context.SaveChangesAsync();

        // Reload to get names
        var created = await _context.MemberRoles
            .Include(mr => mr.Role)
            .Include(mr => mr.AssignedBy)
            .FirstAsync(mr => mr.Id == memberRole.Id);

        var resultDto = new MemberRoleDto
        {
            Id = created.Id,
            RoleId = created.RoleId,
            RoleName = created.Role.Name,
            AssignedById = created.AssignedById,
            AssignedByName = created.AssignedBy != null ? $"{created.AssignedBy.FirstName} {created.AssignedBy.LastName}" : null,
            ValidFrom = created.ValidFrom,
            ValidUntil = created.ValidUntil
        };

        return Ok(resultDto);
    }

    [HttpDelete("{id}/roles/{memberRoleId}")]
    public async Task<IActionResult> DeactivateRole(int id, int memberRoleId)
    {
        var memberRole = await _context.MemberRoles.FirstOrDefaultAsync(mr => mr.Id == memberRoleId && mr.MemberId == id);
        if (memberRole == null)
        {
            return NotFound(new { message = $"Role assignment with ID {memberRoleId} was not found for member {id}." });
        }

        // Deactivate role assignment by setting valid_until to current time
        memberRole.ValidUntil = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
