import React from 'react';
import { renderToString } from 'react-dom/server';
import { Automations } from './src/components/Automations.jsx';
import { createWorkspaceModel } from './src/lib/mockWorkspace.js';

const workspace = createWorkspaceModel({ id: "1", name: "test" });

try {
  renderToString(
    <Automations
      summary={workspace.automationSummary}
      initialTemplates={workspace.automations}
      tip={workspace.automationTip}
      limits={workspace.automationLimits}
      availablePosts={workspace.posts}
    />
  );
  console.log("Render successful!");
} catch (e) {
  console.error("RENDER ERROR:", e);
}
