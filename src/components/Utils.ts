export function currentMetricName (visualization: Record<string, any>): string {
  return `${normalCasing(visualization.parameters.metric)} (${visualization.parameters.scaling} scaling)`;
}

export function descriptionOfVisualization (visualization: Record<string, any>): string {
  return `<strong>
    ${normalCasing(visualization.visualizationType)}
    </strong>
    of 
    ${visualization.parameters.scaling} 
    <strong>
    ${normalCasing(visualization.parameters.metric)}
    </strong> 
    on ${visualization.parameters.community.label}`;
}

export function normalCasing (camelCase: string): string {
  if (camelCase.toLowerCase() === 'linesofcode') {
    return 'LOC (Lines of Code)'
  } else {
    return camelCase.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  }

}