const fs = require('fs');
const path = 'c:\\projects\\GramAlert2.0\\Frontend\\src\\app\\components\\GrievanceDetailsDialog.tsx';
let content = fs.readFileSync(path, 'utf8');

const headMarker = '<<<<<<< HEAD';
const midMarker = '=======';
const endMarker = '>>>>>>> origin/new-feature';

const midIndex = content.indexOf(midMarker);
const endIndex = content.indexOf(endMarker);

let newFeatureContent = content.substring(midIndex + midMarker.length, endIndex).trim();

// Add UpvoteButton import
newFeatureContent = newFeatureContent.replace(
  'import StatusBadge from "./StatusBadge";',
  'import StatusBadge from "./StatusBadge";\nimport UpvoteButton from "./UpvoteButton";'
);

// Add has_upvoted and upvote_count to Grievance interface
newFeatureContent = newFeatureContent.replace(
  'is_overdue?: boolean;\n  created_at?: string;\n}',
  'is_overdue?: boolean;\n  created_at?: string;\n  has_upvoted?: boolean;\n  upvote_count?: number | string;\n}'
);

// Add UpvoteButton to the UI (right after the title h2)
const titleRender = `<h2 className="text-2xl font-bold text-slate-800 flex-1">\n                      {activeGrievance.title}\n                    </h2>`;
const upvoteUi = `\n                    {!isAdmin && (\n                      <UpvoteButton\n                        grievanceId={activeGrievance.id}\n                        upvoteCount={Number(activeGrievance.upvote_count) || 0}\n                        hasUpvoted={!!activeGrievance.has_upvoted}\n                        onVote={async () => {\n                          try {\n                            const res = await api.post(\`grievances/\${activeGrievance.id}/upvote\`);\n                            if (localGrievance) {\n                              setLocalGrievance({\n                                ...localGrievance,\n                                upvote_count: res.data.upvote_count,\n                                has_upvoted: res.data.upvoted\n                              });\n                            }\n                          } catch (error) {\n                            console.error("Failed to toggle upvote", error);\n                            toast.error("Failed to update upvote");\n                          }\n                        }}\n                      />\n                    )}`;

newFeatureContent = newFeatureContent.replace(titleRender, titleRender + upvoteUi);

fs.writeFileSync(path, newFeatureContent, 'utf8');
console.log("Merge complete");
