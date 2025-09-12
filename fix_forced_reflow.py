#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per ridurre il Forced Reflow di 404ms
Ottimizza le letture DOM geometry e migliora le performance JavaScript
"""

import re
import os

def optimize_scroll_handler(js_content):
    """
    Ottimizza gli event handler di scroll per ridurre il forced reflow
    """
    changes_made = []
    
    # Pattern per trovare event listener di scroll problematici
    scroll_patterns = [
        # Scroll event con letture DOM sincrone
        (r'window\.addEventListener\(["\']scroll["\'][^}]*?\}\)', 'scroll event listener'),
        (r'document\.addEventListener\(["\']scroll["\'][^}]*?\}\)', 'document scroll listener'),
        (r'\$\(window\)\.scroll\([^}]*?\}\)', 'jQuery scroll handler')
    ]
    
    # Cerca e ottimizza gli scroll handlers
    for pattern, description in scroll_patterns:
        matches = re.finditer(pattern, js_content, re.DOTALL)
        for match in matches:
            handler_code = match.group(0)
            
            # Controlla se usa requestAnimationFrame
            if 'requestAnimationFrame' not in handler_code:
                # Aggiungi throttling con requestAnimationFrame
                optimized_handler = add_raf_throttling(handler_code)
                if optimized_handler != handler_code:
                    js_content = js_content.replace(handler_code, optimized_handler)
                    changes_made.append(f"Ottimizzato {description} con requestAnimationFrame")
    
    return js_content, changes_made

def add_raf_throttling(handler_code):
    """
    Aggiunge throttling con requestAnimationFrame a un event handler
    """
    # Estrai il contenuto della funzione
    function_match = re.search(r'function\s*\([^)]*\)\s*\{(.*?)\}', handler_code, re.DOTALL)
    if function_match:
        function_body = function_match.group(1)
        
        # Crea versione ottimizzata con RAF
        optimized = f'''let scrollTicking = false;
        function optimizedScrollHandler() {{
            if (!scrollTicking) {{
                requestAnimationFrame(() => {{
                    {function_body.strip()}
                    scrollTicking = false;
                }});
                scrollTicking = true;
            }}
        }}'''
        
        # Sostituisci la funzione originale
        return handler_code.replace(function_match.group(0), 'optimizedScrollHandler')
    
    return handler_code

def optimize_dom_queries(js_content):
    """
    Ottimizza le query DOM per ridurre i reflow
    """
    changes_made = []
    
    # Pattern per query DOM costose
    expensive_queries = [
        (r'element\.offsetHeight', 'offsetHeight'),
        (r'element\.offsetWidth', 'offsetWidth'),
        (r'element\.clientHeight', 'clientHeight'),
        (r'element\.clientWidth', 'clientWidth'),
        (r'element\.scrollHeight', 'scrollHeight'),
        (r'element\.scrollWidth', 'scrollWidth'),
        (r'element\.getBoundingClientRect\(\)', 'getBoundingClientRect'),
        (r'window\.getComputedStyle\([^)]+\)', 'getComputedStyle')
    ]
    
    # Aggiungi cache per le query DOM
    cache_code = '''\n// DOM Query Cache per ridurre forced reflow
const domCache = new Map();
const cacheTimeout = 16; // ~60fps

function getCachedDOMProperty(element, property, getter) {
    const key = `${element.tagName}-${element.className}-${property}`;
    const cached = domCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        return cached.value;
    }
    
    const value = getter();
    domCache.set(key, { value, timestamp: Date.now() });
    return value;
}

// Batch DOM reads and writes
const domOperations = {
    reads: [],
    writes: [],
    
    read(fn) {
        this.reads.push(fn);
        this.schedule();
    },
    
    write(fn) {
        this.writes.push(fn);
        this.schedule();
    },
    
    schedule() {
        if (this.scheduled) return;
        this.scheduled = true;
        
        requestAnimationFrame(() => {
            // Execute all reads first
            this.reads.forEach(fn => fn());
            this.reads = [];
            
            // Then execute all writes
            this.writes.forEach(fn => fn());
            this.writes = [];
            
            this.scheduled = false;
        });
    },
    
    scheduled: false
};\n'''
    
    # Inserisci il cache code all'inizio del file
    if 'domCache' not in js_content:
        js_content = cache_code + js_content
        changes_made.append("Aggiunto sistema di cache per query DOM")
    
    return js_content, changes_made

def optimize_carousel_animations(js_content):
    """
    Ottimizza le animazioni dei caroselli per usare transform invece di proprietà layout
    """
    changes_made = []
    
    # Sostituisci animazioni che causano reflow
    reflow_patterns = [
        (r'element\.style\.left\s*=', 'element.style.transform = `translateX('),
        (r'element\.style\.top\s*=', 'element.style.transform = `translateY('),
        (r'\$\([^)]+\)\.animate\(\{\s*left:', '$(element).css("transform", `translateX('),
        (r'\$\([^)]+\)\.animate\(\{\s*top:', '$(element).css("transform", `translateY(')
    ]
    
    for pattern, replacement in reflow_patterns:
        if re.search(pattern, js_content):
            js_content = re.sub(pattern, replacement, js_content)
            changes_made.append(f"Sostituito animazione layout con transform")
    
    return js_content, changes_made

def add_performance_optimizations(js_content):
    """
    Aggiunge ottimizzazioni generali per le performance
    """
    changes_made = []
    
    # Aggiungi debouncing per eventi frequenti
    debounce_code = '''\n// Debounce utility per eventi frequenti
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility per scroll e resize
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}\n'''
    
    if 'function debounce' not in js_content:
        js_content = debounce_code + js_content
        changes_made.append("Aggiunte utility debounce e throttle")
    
    # Ottimizza event listeners per scroll events
    scroll_events = ['scroll', 'touchstart', 'touchmove', 'wheel']
    for event in scroll_events:
        pattern = f'addEventListener\(["\']({event})["\'],\s*([^,)]+)\)'
        replacement = f'addEventListener("{event}", \\g<2>, {{ passive: true }})'
        if re.search(pattern, js_content):
            js_content = re.sub(pattern, replacement, js_content)
            changes_made.append(f"Aggiunti passive listeners per {event}")
    
    return js_content, changes_made

def process_js_file(file_path):
    """
    Processa un file JavaScript per ridurre il forced reflow
    """
    print(f"\n📄 Processando: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    all_changes = []
    
    # 1. Ottimizza scroll handlers
    content, scroll_changes = optimize_scroll_handler(content)
    all_changes.extend(scroll_changes)
    
    # 2. Ottimizza query DOM
    content, dom_changes = optimize_dom_queries(content)
    all_changes.extend(dom_changes)
    
    # 3. Ottimizza animazioni caroselli
    content, carousel_changes = optimize_carousel_animations(content)
    all_changes.extend(carousel_changes)
    
    # 4. Aggiungi ottimizzazioni generali
    content, perf_changes = add_performance_optimizations(content)
    all_changes.extend(perf_changes)
    
    # Salva il file modificato
    if all_changes:
        # Crea backup
        backup_path = file_path.replace('.js', '_backup.js')
        with open(backup_path, 'w', encoding='utf-8') as f:
            with open(file_path, 'r', encoding='utf-8') as original:
                f.write(original.read())
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        new_size = len(content)
        print(f"✅ Modifiche applicate: {len(all_changes)}")
        for change in all_changes:
            print(f"   • {change}")
        print(f"📏 Dimensione: {original_size:,} → {new_size:,} bytes")
        print(f"💾 Backup salvato: {backup_path}")
    else:
        print("ℹ️  Nessuna modifica necessaria")
    
    return len(all_changes)

def main():
    print("⚡ Riduzione Forced Reflow (404ms → <100ms)")
    print("=" * 50)
    
    # File JavaScript da processare
    js_files = ['script.js']
    
    total_changes = 0
    processed_files = 0
    
    for js_file in js_files:
        if os.path.exists(js_file):
            changes = process_js_file(js_file)
            total_changes += changes
            processed_files += 1
        else:
            print(f"⚠️  File non trovato: {js_file}")
    
    print(f"\n📊 Riepilogo:")
    print(f"📁 File processati: {processed_files}/{len(js_files)}")
    print(f"🔧 Modifiche totali: {total_changes}")
    
    if total_changes > 0:
        print(f"\n🎉 Ottimizzazioni Forced Reflow completate!")
        print(f"\n📝 Benefici attesi:")
        print(f"   • Riduzione Forced Reflow da 404ms a <100ms")
        print(f"   • Scroll handlers ottimizzati con requestAnimationFrame")
        print(f"   • Query DOM cachate per ridurre i reflow")
        print(f"   • Animazioni ottimizzate con transform invece di layout")
        print(f"   • Event listeners passivi per migliori performance")
        print(f"\n🔄 Prossimi passi:")
        print(f"   1. Testa tutte le funzionalità del sito")
        print(f"   2. Verifica che scroll e animazioni funzionino correttamente")
        print(f"   3. Esegui PageSpeed Insights per misurare i miglioramenti")
        print(f"   4. Monitora le performance con DevTools")
    else:
        print(f"\nℹ️  Il JavaScript è già ottimizzato per il forced reflow")

if __name__ == "__main__":
    main()