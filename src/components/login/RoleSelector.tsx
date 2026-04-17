import { Shield, HardHat, User } from 'lucide-react';
import type { Role } from '../../types';

interface RoleSelectorProps {
  selected: Role;
  onSelect: (role: Role) => void;
}

const ROLES: { role: Role; label: string; icon: typeof User }[] = [
  { role: 'petugas', label: 'Petugas', icon: HardHat },
  { role: 'warga', label: 'Warga', icon: User },
];

export default function RoleSelector({ selected, onSelect }: RoleSelectorProps) {
  return (
    <div className="flex gap-2 mb-5">
      {ROLES.map(({ role, label, icon: Icon }) => {
        const isActive = selected === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onSelect(role)}
            className={`flex-1 py-2.5 px-2 border-2 rounded-app-sm bg-white font-sans text-xs font-semibold cursor-pointer transition-all text-center flex flex-col items-center gap-1 ${
              isActive
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
