import { create } from "zustand";

export type Branch = {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  color?: string;
};

type BranchesState = {
  branches: Branch[];
  selectedBranchId: string | null;
  loading: boolean;
  setBranches: (branches: Branch[]) => void;
  addBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (id: string) => void;
  setSelectedBranch: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useBranchesStore = create<BranchesState>((set) => ({
  branches: [],
  selectedBranchId: null,
  loading: true,
  setBranches: (branches) => set({ branches, loading: false }),
  addBranch: (branch) =>
    set((state) => ({
      branches: [...state.branches, branch],
    })),
  updateBranch: (branch) =>
    set((state) => ({
      branches: state.branches.map((b) => (b.id === branch.id ? branch : b)),
    })),
  deleteBranch: (id) =>
    set((state) => ({
      branches: state.branches.filter((b) => b.id !== id),
      selectedBranchId: state.selectedBranchId === id ? null : state.selectedBranchId,
    })),
  setSelectedBranch: (id) => set({ selectedBranchId: id }),
  setLoading: (loading) => set({ loading }),
}));
