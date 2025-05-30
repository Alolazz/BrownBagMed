// react-select's CreatableSelect needs the generic type for multi-select to be set as follows:
// CreatableSelect<OptionType, true>
// The second generic argument (true) enables multi-select mode for type inference.
// This fixes the isMulti type error.

// Example usage:
// <CreatableSelect<OptionType, true> ... isMulti ... />
