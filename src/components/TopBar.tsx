import Image from 'next/image';
import logo_transparent from '../../public/mediapack/logo_transparent.png';

export default function TopBar() {
  return (
    <div className="bg-background py-2 flex items-center justify-between">
      <Image className="icon" src={logo_transparent} alt="Gluo banner" />

      <div className="flex items-center gap-4">
        <div className="flex gap-1 items-center outline-2 outline-secondary-bg rounded-2xl py-1 px-2 font-medium">
          <i className="fas fa-heart text-red-500" aria-hidden="true"></i>
          100
        </div>
        <div className="size-6">
          <i className="fas fa-bell" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  );
}
