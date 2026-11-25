"""
AI Assistant services for WAYNEX.
GeminiService wraps Google Gemini API for intelligent travel assistance.
"""
import logging
import os
from typing import Dict, List, Optional, Any
from django.conf import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """
    Service wrapper for Google Gemini API.
    Provides travel intelligence, conversational recommendations, and travel guidance.
    Handles missing or invalid API keys gracefully with context-aware fallback.
    """

    DEFAULT_SYSTEM_INSTRUCTION = (
        "You are WAYNEX, an expert AI travel guide and itinerary planner specializing in India. "
        "You provide accurate, culturally rich, safe, and practical travel recommendations. "
        "Cover transportation (buses, trains, local transport), budget optimization, local cuisine, "
        "cultural etiquette, safety tips, best seasons to visit, and hidden gems across Indian states."
    )

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or getattr(settings, 'GEMINI_API_KEY', '') or os.environ.get('GEMINI_API_KEY', '')
        self._model = None
        self._is_configured = False
        self._initialize()

    def _initialize(self):
        """Initialize the Gemini client if API key is provided and library is available."""
        if not self.api_key:
            logger.info("GeminiService initialized without API key. Operating in offline/fallback mode.")
            return

        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self._model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=self.DEFAULT_SYSTEM_INSTRUCTION,
            )
            self._is_configured = True
            logger.info("GeminiService configured successfully with Gemini API.")
        except ImportError:
            logger.warning("google-generativeai package not installed. GeminiService in fallback mode.")
            self._is_configured = False
        except Exception as e:
            logger.error(f"Error configuring GeminiService: {e}")
            self._is_configured = False

    @property
    def is_available(self) -> bool:
        """Check if live Gemini API is configured and available."""
        return self._is_configured and self._model is not None

    def chat(self, message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Conduct a multi-turn chat with the travel assistant.
        
        Args:
            message: User query or prompt.
            history: Optional list of past messages in format [{'role': 'user'|'model', 'parts': '...'}].
            
        Returns:
            Dictionary with response text, model used, and status.
        """
        if not message or not message.strip():
            return {
                'success': False,
                'response': "Please provide a valid question or travel query.",
                'mode': 'offline',
            }

        if self.is_available:
            try:
                # Format conversation history if provided
                gemini_history = []
                if history:
                    for h in history:
                        role = 'user' if h.get('role') == 'user' else 'model'
                        content = h.get('parts', '') or h.get('content', '')
                        if content:
                            gemini_history.append({'role': role, 'parts': [content]})

                chat_session = self._model.start_chat(history=gemini_history)
                response = chat_session.send_message(message)
                return {
                    'success': True,
                    'response': response.text,
                    'mode': 'gemini-live',
                }
            except Exception as e:
                logger.error(f"Gemini API chat error: {e}")
                # Graceful fallback on API error
                return self._fallback_chat(message, error_note=str(e))

        return self._fallback_chat(message)

    def get_recommendations(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Get structured travel recommendations based on user prompt and context.
        
        Args:
            prompt: Detailed recommendation prompt.
            context: Optional dictionary with budget, duration, starting location, preferences.
            
        Returns:
            Dictionary with recommendations and metadata.
        """
        full_prompt = prompt
        if context:
            ctx_str = "\n".join([f"- {k}: {v}" for k, v in context.items() if v])
            full_prompt = f"Context:\n{ctx_str}\n\nUser Request: {prompt}"

        if self.is_available:
            try:
                response = self._model.generate_content(
                    f"Provide clear, actionable travel recommendations for India based on this request:\n{full_prompt}"
                )
                return {
                    'success': True,
                    'recommendations': response.text,
                    'mode': 'gemini-live',
                }
            except Exception as e:
                logger.error(f"Gemini API recommendations error: {e}")
                return self._fallback_recommendations(prompt, context, error_note=str(e))

        return self._fallback_recommendations(prompt, context)

    def _fallback_chat(self, message: str, error_note: Optional[str] = None) -> Dict[str, Any]:
        """Provide intelligent rule-based travel assistant responses when API key is missing."""
        msg_lower = message.lower()
        reply_lines = []

        if 'karnataka' in msg_lower or 'bangalore' in msg_lower or 'bengaluru' in msg_lower:
            reply_lines.append(
                "Karnataka offers an incredible blend of heritage, nature, and technology. "
                "Top highlights include Bengaluru (Silicon Valley of India, Lalbagh, Cubbon Park), "
                "Mysuru (Mysore Palace, Chamundi Hills, Dasara celebrations), "
                "Hampi (UNESCO World Heritage Vijayanagara ruins), and Coorg (coffee estates and Abbey Falls)."
            )
        elif 'hampi' in msg_lower:
            reply_lines.append(
                "Hampi is a UNESCO World Heritage site featuring the majestic ruins of the 14th-century Vijayanagara Empire. "
                "Key spots: Virupaksha Temple, Stone Chariot at Vijaya Vittala Temple, and Matanga Hill for sunrise. "
                "Best visited between October and February when the weather is pleasant."
            )
        elif 'budget' in msg_lower:
            reply_lines.append(
                "For budget travel in India: utilize KSRTC and Indian Railways for affordable intercity transport. "
                "Stay in verified homestays and hostels (ranging ₹500 - ₹1,500/night). "
                "Enjoy authentic local thalis and street food for ₹100 - ₹300/meal."
            )
        elif 'safety' in msg_lower or 'emergency' in msg_lower:
            reply_lines.append(
                "WAYNEX Safety Advisory: Always keep trusted emergency contacts updated in your profile. "
                "The national emergency helpline in India is 112 (Police: 100, Ambulance: 108, Women Helpline: 1091). "
                "WAYNEX provides real-time location sharing and SOS check-ins."
            )
        else:
            reply_lines.append(
                f"Thank you for contacting WAYNEX Travel Intelligence. Regarding '{message.strip()}': "
                "India offers diverse experiences across 28 states and 8 union territories. "
                "You can explore pilot destinations in Karnataka such as Hampi, Coorg, Gokarna, and Mysuru. "
                "Please configure GEMINI_API_KEY in your environment for dynamic real-time AI responses."
            )

        return {
            'success': True,
            'response': "\n\n".join(reply_lines),
            'mode': 'offline-fallback',
            'api_configured': bool(self.api_key),
            'note': error_note or 'Gemini API key not configured or live service unavailable. Displaying travel intelligence knowledge base.',
        }

    def _fallback_recommendations(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
        error_note: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Provide structured travel recommendations in offline mode."""
        return {
            'success': True,
            'recommendations': (
                "WAYNEX Recommended Itinerary (Karnataka Highlights):\n"
                "1. Day 1-2: Bengaluru - Explore Cubbon Park, Bangalore Palace, and Indiranagar dining.\n"
                "2. Day 3-4: Mysuru - Royal Mysore Palace, Chamundeshwari Temple, and Devaraja Market.\n"
                "3. Day 5-6: Coorg (Kodagu) - Coffee plantation walk, Abbey Falls, and Raja's Seat sunset.\n"
                "4. Day 7-8: Hampi - Explore the UNESCO boulder landscape, Virupaksha, and Vittala temples."
            ),
            'context_considered': context or {},
            'mode': 'offline-fallback',
            'api_configured': bool(self.api_key),
            'note': error_note or 'Running in offline fallback mode.',
        }
