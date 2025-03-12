import { type layout } from "@/types/types"

export const mathLayout: layout = [
	{
		name: "calculus",
		previewName: "حسابان",
		sections: [
			[
				"sequence",
				"algebraic_expression",
				"square_root",
				"inequality",
				"quadratic_equation",
				"equation",
				"analytic_geometry",
				"function",
				"division",
			],
			["absolute_value", "floor_function", "logarithm", "trigonometry"],
			["limit", "infinity", "derivative", "derivative_application"],
		],
	},
	{
		name: "discrete",
		previewName: "گسسته",
		sections: [
			[
				"mathematical_reasoning",
				"divisibility",
				"lcm_gcd",
				"division_theorem",
				"modular_arithmetic",
				"calendar",
			],
			[
				"graph_theory",
				"graph_types",
				"connectivity_path_cycle",
				"dominating_set",
			],
			[
				"combinatorics",
				"latin_square",
				"inclusion_exclusion_principle",
				"pigeonhole_principle",
			],
		],
	},
	{
		name: "geometry",
		previewName: "هندسه",
		sections: [
			["g10_1", "g10_2", "g10_3", "g10_4"],
			["g11_1", "g11_2", "g11_3"],
			["g12_1", "g12_2", "g12_3"],
		],
	},
	{
		name: "statistics",
		previewName: "آمار",
		sections: [
			["mathematical_logic", "set", "probability"],
			["descriptive_statistics", "inferential_statistics"],
		],
	},
]

export const physicsLayout: layout = [
	{
		name: "10",
		previewName: "دهم",
		sections: [["p10_1", "p10_2", "p10_3", "p10_4", "p10_5"]],
	},
	{
		name: "11",
		previewName: "یازدهم",
		sections: [["p11_1", "p11_2", "p11_3", "p11_4"]],
	},
	{
		name: "12",
		previewName: "دوازدهم",
		sections: [["p12_1", "p12_2", "p12_3", "p12_4", "p12_5", "p12_6"]],
	},
]

export const chemistryLayout: layout = [
	{
		name: "memorization",
		previewName: "حفظیات",
		sections: [
			["c10_1", "c10_2", "c10_3"],
			["c11_1", "c11_2", "c11_3"],
			["c12_1", "c12_2", "c12_3", "c12_4"],
			["mixed"],
		],
	},
	{
		name: "conceptual_calculation",
		previewName: "محاسباتی و مفهومی",
		sections: [
			[
				"periodic_table",
				"electromagnetic_radiation",
				"Lewis_structure",
				"chemical_equation",
				"gas_laws",
				"stoichiometry",
				"dissolution",
				"chemical_bounds",
			],
			[
				"hydrocarbon",
				"heat",
				"enthalpy",
				"bond_enthalpy",
				"hess_law",
				"functional_group",
				"chemical_kinetics",
				"polymer",
			],
			[
				"soap",
				"acid_base",
				"oxidation_state",
				"electrochemical_cell",
				"compounds",
				"activation_energy",
				"chemical_equilibrium",
			],
		],
	},
]
