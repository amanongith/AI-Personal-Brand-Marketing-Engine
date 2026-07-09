import React from 'react';
import { Sparkles, FileText, Send } from 'lucide-react';

export default function GeneratorTab({
  genPlatform,
  setGenPlatform,
  genTone,
  setGenTone,
  genContentType,
  setGenContentType,
  genTopic,
  setGenTopic,
  genInstructions,
  setGenInstructions,
  generatingContent,
  handleGenerateContent,
  generatedOutput,
  handleSaveDraft,
  contentStatus
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
      {/* Input Config Card */}
      <div className="card">
        <h3 className="margin-b-24">Generation Options</h3>
        <form onSubmit={handleGenerateContent}>
          <div className="form-group">
            <label>Target Platform</label>
            <select value={genPlatform} onChange={(e) => setGenPlatform(e.target.value)}>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter / X</option>
              <option value="instagram">Instagram Caption</option>
              <option value="youtube">YouTube Description</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Tone of Voice</label>
              <select value={genTone} onChange={(e) => setGenTone(e.target.value)}>
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="inspirational">Inspirational</option>
                <option value="educational">Educational</option>
                <option value="direct">Direct</option>
              </select>
            </div>
            <div className="form-group">
              <label>Content Template</label>
              <select value={genContentType} onChange={(e) => setGenContentType(e.target.value)}>
                <option value="educational">Educational / Core Topic</option>
                <option value="personal_story">Personal Story</option>
                <option value="industry_update">Industry Update</option>
                <option value="promotion">Promo / Launch</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Content Topic</label>
            <textarea 
              value={genTopic} 
              onChange={(e) => setGenTopic(e.target.value)} 
              placeholder="Enter what you want the post to be about..." 
              required 
            />
          </div>

          <div className="form-group">
            <label>Additional Instructions (Optional)</label>
            <input 
              type="text" 
              value={genInstructions} 
              onChange={(e) => setGenInstructions(e.target.value)}
              placeholder="e.g. Include bullet points, keep it short..."
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={generatingContent}>
            {generatingContent ? (
              <>
                <div className="loading-spinner" />
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Content Draft
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Output Card */}
      <div className="card ai-output-card">
        <div className="flex-between margin-b-24">
          <h3>Draft Output</h3>
          {generatedOutput && (
            <button 
              onClick={handleSaveDraft} 
              disabled={contentStatus === 'saving'}
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              {contentStatus === 'saving' ? <div className="loading-spinner" /> : <Send size={14} />}
              Save to Queue
            </button>
          )}
        </div>

        {generatedOutput ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="ai-output-text" style={{ whiteSpace: 'pre-wrap' }}>
              {typeof generatedOutput === 'string' ? generatedOutput : JSON.stringify(generatedOutput, null, 2)}
            </div>
            {contentStatus === 'success' && (
              <span className="font-14" style={{ color: 'var(--accent-teal)', textAlign: 'right' }}>
                Draft saved to content list successfully!
              </span>
            )}
            {contentStatus === 'error' && (
              <span className="font-14" style={{ color: '#f43f5e', textAlign: 'right' }}>
                Failed to save draft to database.
              </span>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="card-icon teal" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
              <FileText size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '4px' }}>No Draft Generated Yet</h4>
              <p className="font-12 text-muted" style={{ maxWidth: '300px', margin: '0 auto' }}>
                Fill in the generation options on the left and click "Generate" to generate a tailored multi-platform post draft.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
