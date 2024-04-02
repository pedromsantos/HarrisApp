export interface TabProperties {
  tab: string;
}
function Tab({ tab }: TabProperties) {
  return (
    <div>
      <div>
        <b>Guitar Line</b>
      </div>
      <div>
        <pre>{tab}</pre>
      </div>
    </div>
  );
}

export default Tab;
