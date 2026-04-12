import { SlidersHorizontal, Package, Tag, Palette } from "lucide-react";

const Filters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const selectClassName = "w-full bg-white border border-gray-200 text-gray-700 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none text-sm font-semibold shadow-sm";
  const labelClassName = "flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase mt-6 mb-3";

  return (
    <div className="bg-transparent space-y-8">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <SlidersHorizontal className="text-black w-5 h-5" />
        <h2 className="font-bold text-lg text-gray-900">Filters</h2>
      </div>

      <div className="space-y-6">
        <div className="mb-2">
          <label className={labelClassName}>
            <Tag className="w-4 h-4 text-purple-600" /> Categories
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'all', label: 'All', value: '' },
              { id: 'button', label: 'Buttons', value: 'button' },
              { id: 'input', label: 'Inputs', value: 'input' },
              { id: 'form', label: 'Forms', value: 'form' },
              { id: 'card', label: 'Cards', value: 'card' },
              { id: 'modal', label: 'Modals', value: 'modal' },
              { id: 'feedback', label: 'Feedback', value: 'feedback' },
              { id: 'data display', label: 'Data', value: 'data display' },
              { id: 'navigation', label: 'Navbar', value: 'navigation' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilters({ ...filters, category: cat.value })}
                className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                  filters.category === cat.value
                    ? "bg-black border-black text-white shadow-md shadow-black/10"
                    : "bg-white border-gray-200 text-gray-500 hover:border-black hover:text-black"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className={labelClassName}>
             <Package className="w-4 h-4 text-blue-600" /> Framework
           </label>
           <div className="relative">
             <select
               name="framework"
               value={filters.framework}
               onChange={handleChange}
               className={selectClassName}
             >
               <option value="">All Frameworks</option>
               <option value="react">React</option>
             </select>
           </div>
        </div>

        <div>
           <label className={labelClassName}>
             <Palette className="w-4 h-4 text-black" /> Library
           </label>
           <select
             name="library"
             value={filters.library}
             onChange={handleChange}
             className={selectClassName}
           >
             <option value="">All Libraries</option>
             <option value="shadcn">shadcn/ui</option>
             <option value="mui">Material UI (MUI)</option>
             <option value="chakra">Chakra UI</option>
             <option value="nextui">NextUI</option>
             <option value="radix">Radix UI</option>
             <option value="untitled-ui">Untitled UI React</option>
             <option value="tailwind-plus">Tailwind Plus</option>
             <option value="kibo-ui">Kibo UI</option>
             <option value="react-aria">React Aria Components</option>
             <option value="reshaped">Reshaped</option>
             <option value="align-ui">AlignUI</option>
             <option value="base-ui">Base UI</option>
             <option value="tailark">Tailark</option>
             <option value="heroui">HeroUI</option>
             <option value="mantine">Mantine UI</option>
             <option value="daisyui">daisyUI</option>
             <option value="ant-design">Ant Design</option>
           </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;