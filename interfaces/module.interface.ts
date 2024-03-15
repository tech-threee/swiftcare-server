export interface Module {
  title: string;
  slug: string;
  status: string;
}

export interface ModuleUpdate extends Omit<Module, 'slug'> {
  title: string;
  status: string;
}
