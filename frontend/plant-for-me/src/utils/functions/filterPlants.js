
export const appendURLSearchParams = (filterParameters) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filterParameters)) {
    if(key === "isBlooming" && value !== "none") {
      value === 0 ? params.append(key, true) : params.append(key, false)
      continue;
    }
    if(value !== "none" && value !== "") {
      params.append(key, value)
    }
  }

  return params;

}

export const appendURLSearchParamsWithCategories = (params, checkedCategories, categoryNames) => {
  checkedCategories.forEach((cc, index) => cc === true && params.append('category', categoryNames[index]))
}

export const appendURLSearchParamsWithBloomingMonths = (params, checkedBloomingMonths) => {
  checkedBloomingMonths.forEach((bm, index) => bm === true && params.append('bloomingMonth', index))
}
