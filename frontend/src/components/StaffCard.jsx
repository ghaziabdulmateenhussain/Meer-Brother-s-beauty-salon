import React from 'react';

export default function StaffCard({ member }) {
  return (
    <div className="card overflow-hidden text-center p-6">
      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gold/10 mb-4 border-2 border-gold/30">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gold text-2xl font-display">
            {member.name.split(' ').map((n) => n[0]).join('')}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg">{member.name}</h3>
      <p className="text-gold text-sm mb-2">{member.position}</p>
      <p className="text-xs text-onyx/60 dark:text-white/60 mb-1">Specialty: {member.specialty}</p>
      <p className="text-xs text-onyx/50 dark:text-white/50">{member.experience} experience</p>
    </div>
  );
}
